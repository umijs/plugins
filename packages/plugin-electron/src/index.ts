import { IApi } from 'umi';
import { join } from 'path';
import ora from 'ora';
import { FatherBuildCli, WatchReturnType } from './fatherBuild';
import { ElectronProcessManager } from './electronManager';
import { check } from './check';
import {
  buildVersion,
  generateEntryFile,
  generateMd5,
  getEntry,
} from './utils';
import { packageAnalyze } from './features/package-analyze';
import { buildElectron } from './buildElectron';
import { existsSync } from 'fs';
import { TMP_DIR } from './constants';

export default (api: IApi) => {
  // 配置
  api.describe({
    key: 'electron',
    config: {
      schema(joi) {
        return joi.object({
          src: joi.string(),
          builder: joi.object(),
          throwWhileUnusedDependencies: joi.boolean(),
        });
      },
      default: {
        throwWhileUnusedDependencies: true,
      },
    },
    enableBy: () => !!api.userConfig.electron,
  });

  let fatherBuildCli: FatherBuildCli | undefined;
  let electronManager: ElectronProcessManager | undefined;
  let fatherBuildWatcher: WatchReturnType | undefined;

  let isFirstDevDone: boolean = true;

  api.onDevCompileDone(async () => {
    if (!isFirstDevDone) {
      return;
    }
    const spinner = ora({
      prefixText: '[umi electron]',
      text: 'staring dev...\n',
    }).start();
    const { src = 'src/main' } = api.config.electron;
    spinner.text = 'checking package.json...\n';
    check();
    spinner.text = 'building version.json...\n';
    buildVersion();
    electronManager = new ElectronProcessManager();
    fatherBuildCli = new FatherBuildCli({
      src,
      configPath: join(__dirname, './config/father.js'),
    });
    fatherBuildWatcher = await fatherBuildCli.watch({
      onBuildComplete: () => {
        spinner.succeed('done~');
        electronManager?.start();
      },
      beforeBuild: () => {
        spinner.start('compiling...');
      },
    });
    spinner.text = 'generate entry file of development mode...\n';
    generateEntryFile(getEntry('development'));
    isFirstDevDone = false;
  });

  api.onExit(() => {
    fatherBuildWatcher?.exit();
  });

  api.onBuildComplete(async ({ err }) => {
    if (err) {
      return;
    }

    const spinner = ora({
      prefixText: '[umi electron]',
      text: 'staring build...\n',
    }).start();

    check();
    spinner.text = 'start build application';
    // 支持 (pwd)/electron-builder.config.js 和 config.electron.builder
    let fileConfig = {};
    const customConfigFilePath = join(
      process.cwd(),
      'electron-builder.config.js',
    );
    if (existsSync(customConfigFilePath)) {
      fileConfig =
        require(join(process.cwd(), 'electron-builder.config.js')) || {};
    }
    spinner.text = 'build main process code';
    await fatherBuildCli?.build();
    spinner.text = 'build entry.js';
    generateEntryFile(getEntry('production'));
    spinner.text = 'build version.json';
    buildVersion();
    spinner.text = 'package analyze';
    packageAnalyze({
      throwWhileUnusedDependencies:
        api.config.electron.throwWhileUnusedDependencies,
    });
    spinner.succeed(
      'Preparations have been completed, ready to start electron-builder',
    );
    const result = await buildElectron({
      ...fileConfig,
      ...(api.config.electron.builder || {}),
    });
    spinner.text = 'generating md5';
    spinner.start();
    const filenames = generateMd5(result);
    console.log('\n' + filenames.join('\n'));
    spinner.succeed('done');
  });

  api.modifyConfig({
    fn: (initialValue) => {
      return {
        ...initialValue,
        outputPath: `./${TMP_DIR}/renderer`,
        history: {
          type: 'hash',
        },
        publicPath: '../',
      };
    },
    stage: Infinity,
  });
};
