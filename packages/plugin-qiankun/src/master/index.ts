/* eslint-disable quotes */
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
// eslint-disable-next-line import/no-unresolved
import { IApi, utils } from 'umi';

import { defaultHistoryType, defaultMasterRootId } from '../common';
import { MasterOptions } from '../types';
import modifyRoutes from './modifyRoutes';

export default function(api: IApi) {
  api.describe({
    enableBy() {
      return api.userConfig.qiankun && api.userConfig.qiankun.master;
    },
  });

  api.addRuntimePlugin(() => require.resolve('./runtimePlugin'));

  api.modifyDefaultConfig(config => ({
    ...config,
    mountElementId: defaultMasterRootId,
    disableGlobalVariables: true,
  }));

  // apps 可能在构建期为空
  const options: MasterOptions = api.userConfig.qiankun.master;
  const { apps = [], routeBindingAlias = 'microApp' } = options || {};
  modifyRoutes(api, apps, routeBindingAlias);

  const rootExportsJsFile = join(api.paths.absSrcPath!, 'rootExports.js');
  const rootExportsTsFile = join(api.paths.absSrcPath!, 'rootExports.ts');
  const rootExportsJsFileExisted = existsSync(rootExportsJsFile);
  const rootExportsFileExisted =
    rootExportsJsFileExisted || existsSync(rootExportsTsFile);

  api.addTmpGenerateWatcherPaths(() =>
    rootExportsJsFileExisted ? rootExportsJsFile : rootExportsTsFile,
  );

  api.onGenerateFiles(() => {
    const {
      config: { history },
    } = api;
    const masterHistoryType = history?.type || defaultHistoryType;
    const rootExports = `
window.g_rootExports = ${
      rootExportsFileExisted ? `require('@/rootExports')` : `{}`
    };
    `.trim();

    api.writeTmpFile({
      path: 'plugin-qiankun/qiankunRootExports.js',
      content: rootExports,
    });

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

    api.writeTmpFile({
      path: 'plugin-qiankun/MicroApp.tsx',
      content: readFileSync(join(__dirname, 'MicroApp.tsx.tpl'), 'utf-8'),
    });
  });

  api.addUmiExports(() => [
    {
      specifiers: ['qiankunStart'],
      source: utils.winPath('../plugin-qiankun/qiankunDefer'),
    },
  ]);

  const pinnedExport = 'MicroApp';
  api.addUmiExports(() => [
    {
      specifiers: [pinnedExport],
      source: utils.winPath('../plugin-qiankun/MicroApp'),
    },
  ]);

  // 存在别名导出时再导出一份别名
  const { exportComponentAlias } = options || {};
  if (exportComponentAlias && exportComponentAlias !== pinnedExport) {
    api.addUmiExports(() => [
      {
        specifiers: [{ local: pinnedExport, exported: exportComponentAlias }],
        source: utils.winPath('../plugin-qiankun/MicroApp'),
      },
    ]);
  }
}
