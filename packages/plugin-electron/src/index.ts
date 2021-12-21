import { IApi } from 'umi';
import { join } from 'path';
import * as ora from 'ora';
import { FatherBuildCli, WatchReturnType } from './fatherCli';
import { ElectronProcessManager } from './electronManager';
import { check } from './check';
import { buildVersion, generateEntryFile, getEntry, log } from './utils';
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

  api.onDevCompileDone(() => {
    if (!isFirstDevDone) {
      return;
    }
    const spinner = ora('staring electron...').start();
    const { src = 'src/main' } = api.config.electron;
    spinner.text = 'checking package.json...';
    check();
    spinner.text = 'building version.json...';
    buildVersion();
    electronManager = new ElectronProcessManager();
    fatherBuildCli = new FatherBuildCli({
      src,
      configPath: join(__dirname, './config/father.js'),
    });
    fatherBuildWatcher = fatherBuildCli.watch({
      onBuild: () => {
        electronManager?.start();
      },
    });
    spinner.text = 'generate entry file of development mode...';
    generateEntryFile(getEntry('development'));
    spinner.stop();
    isFirstDevDone = false;
  });

  api.onExit(() => {
    fatherBuildWatcher?.exit();
  });

  api.onBuildComplete(async ({ err }) => {
    if (err) {
      return;
    }
    check();
    log.info('start build application');
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
    await fatherBuildCli?.build();
    log.success('build main process code');
    generateEntryFile(getEntry('production'));
    log.success('build entry.js');
    buildVersion();
    log.success('build version.json');
    packageAnalyze({
      throwWhileUnusedDependencies:
        api.config.electron.throwWhileUnusedDependencies,
    });
    log.success('package analyze');
    log.info('build electron application');
    buildElectron({
      ...fileConfig,
      ...(api.config.electron.builder || {}),
    });
  });

  api.modifyConfig({
    fn: (initialValue) => {
      return {
        ...initialValue,
        outputPath: `./${TMP_DIR}/renderer`,
        history: {
          type: 'hash',
        },
        publicPath: './',
      };
    },
    stage: Infinity,
  });
};
