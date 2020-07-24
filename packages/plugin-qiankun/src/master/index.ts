/* eslint-disable quotes */
import { readFileSync } from 'fs';
import { join } from 'path';
// eslint-disable-next-line import/no-unresolved
import { IApi, utils } from 'umi';
import {
  defaultHistoryType,
  defaultMasterRootId,
  qiankunStateForSlaveModelNamespace,
} from '../common';
import modifyRoutes from './modifyRoutes';
import { hasExportWithName } from './utils';

const { getFile, winPath } = utils;

export default function(api: IApi) {
  api.describe({
    enableBy() {
      return (
        !!api.userConfig?.qiankun?.master ||
        !!process.env.INITIAL_QIANKUN_MASTER_OPTIONS
      );
    },
  });

  api.modifyConfig(config => ({
    ...config,
    qiankun: {
      ...config?.qiankun,
      master: {
        ...JSON.parse(process.env.INITIAL_QIANKUN_MASTER_OPTIONS || '{}'),
        ...config?.qiankun?.master,
      },
    },
  }));

  api.addRuntimePlugin(() => require.resolve('./runtimePlugin'));

  api.modifyDefaultConfig(config => ({
    ...config,
    mountElementId: defaultMasterRootId,
    disableGlobalVariables: true,
  }));

  modifyRoutes(api);

  const appFile = getFile({
    base: api.paths.absSrcPath!,
    fileNameWithoutExt: 'app',
    type: 'javascript',
  });
  if (appFile) {
    const exportName = 'useQiankunStateForSlave';
    const hasExport = hasExportWithName({
      name: exportName,
      filePath: appFile.path,
    });

    if (hasExport) {
      api.addRuntimePluginKey(() => exportName);
      api.register({
        key: 'addExtraModels',
        fn: () => [
          {
            absPath: winPath(appFile.path),
            namespace: qiankunStateForSlaveModelNamespace,
            exportName,
          },
        ],
      });
    }
  }

  api.onGenerateFiles(() => {
    const {
      config: {
        history,
        qiankun: { master: options },
      },
    } = api;
    const masterHistoryType = (history && history?.type) || defaultHistoryType;

    api.writeTmpFile({
      path: 'plugin-qiankun/masterOptions.js',
      content: `
      let options = ${JSON.stringify({
        masterHistoryType,
        ...options,
      })};
      export const getMasterOptions = () => options;
      export const setMasterOptions = (newOpts) => options = ({ ...options, ...newOpts });
      `,
    });

    api.writeTmpFile({
      path: 'plugin-qiankun/MicroApp.tsx',
      content: readFileSync(join(__dirname, 'MicroApp.tsx.tpl'), 'utf-8'),
    });
  });

  api.addUmiExports(() => {
    const pinnedExport = 'MicroApp';
    const exports: any[] = [
      {
        specifiers: [pinnedExport],
        source: winPath('../plugin-qiankun/MicroApp'),
      },
    ];

    const { exportComponentAlias } = api.config.qiankun.master!;
    // 存在别名导出时再导出一份别名
    if (exportComponentAlias && exportComponentAlias !== pinnedExport) {
      exports.push({
        specifiers: [{ local: pinnedExport, exported: exportComponentAlias }],
        source: winPath('../plugin-qiankun/MicroApp'),
      });
    }

    return exports;
  });

  api.addUmiExports(() => {
    return {
      specifiers: ['getMasterOptions'],
      source: winPath('../plugin-qiankun/masterOptions.js'),
    };
  });

  useCompatibleMode(api);
}

function useCompatibleMode(api: IApi) {
  const rootExportsJsFile = getFile({
    base: api.paths.absSrcPath!,
    type: 'javascript',
    fileNameWithoutExt: 'rootExports',
  });

  if (rootExportsJsFile) {
    api.addTmpGenerateWatcherPaths(() => rootExportsJsFile.path);
  }

  api.onGenerateFiles(() => {
    const rootExports = `
    if (typeof window !== 'undefined') {
      window.g_rootExports = ${
        rootExportsJsFile ? `require('@/rootExports')` : `{}`
      };
    }
    `.trim();

    api.writeTmpFile({
      path: 'plugin-qiankun/qiankunRootExports.js',
      content: rootExports,
    });

    // TODO 兼容以前版本的 defer 配置，后续需要移除
    api.writeTmpFile({
      path: 'plugin-qiankun/qiankunDefer.js',
      content: `
      class Deferred {
        constructor() {
          this.promise = new Promise(resolve => this.resolve = resolve);
        }
      }
      export const deferred = new Deferred();
      export const qiankunStart = deferred.resolve;
    `.trim(),
    });
  });

  // TODO 兼容以前版本的 defer 配置，后续需要移除
  api.addUmiExports(() => [
    {
      specifiers: ['qiankunStart'],
      source: winPath('../plugin-qiankun/qiankunDefer'),
    },
  ]);
}
