import { IApi } from 'umi';
import { join } from 'path';
import { FatherBuildCli, WatchReturnType } from './fatherCli';
import { ElectronProcessManager } from './electronManager';
import { check } from './check';
import { buildVersion, generateEntryFile, getEntry, log } from './utils';
import { packageAnalyze } from './features/package-analyze';
import { buildElectron } from './buildElectron';
import { existsSync } from 'fs';
import { TMP_DIR } from './constants';
import rimraf from 'rimraf';

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

  // 启动编译脚本
  api.onStart(() => {
    if (!(api.env === 'development')) return;
    const { src = 'src/main' } = api.config.electron;
    check();
    buildVersion();
    log.success('build version.json');
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
    generateEntryFile(getEntry('development'));
    log.success('build entry.js');
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
