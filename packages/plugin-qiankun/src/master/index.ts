/* eslint-disable quotes */
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
// eslint-disable-next-line import/no-unresolved
import { IApi, utils } from 'umi';

import { defaultHistoryType, defaultMasterRootId } from '../common';
import modifyRoutes from './modifyRoutes';

export default function(api: IApi) {
  api.describe({
    enableBy() {
      return !!api.config?.qiankun?.master;
    },
  });

  api.addRuntimePlugin(() => require.resolve('./runtimePlugin'));

  api.modifyDefaultConfig(config => ({
    ...config,
    mountElementId: defaultMasterRootId,
    disableGlobalVariables: true,
  }));

  modifyRoutes(api);

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
      config: {
        history,
        qiankun: { master: options },
      },
    } = api;
    const masterHistoryType = history?.type || defaultHistoryType;
    const rootExports = `
    if (typeof window !== 'undefined') {
      window.g_rootExports = ${
        rootExportsFileExisted ? `require('@/rootExports')` : `{}`
      };
    }
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

    const { dependencies = {} } = require(join(
      api.paths.cwd || '',
      'package.json',
    ));

    api.writeTmpFile({
      path: 'plugin-qiankun/MicroApp.tsx',
      content: utils.Mustache.render(
        readFileSync(join(__dirname, 'MicroApp.tsx.tpl'), 'utf-8'),
        {
          hasAntd: dependencies.antd || dependencies['@alipay/bigfish'],
        },
      ),
    });
  });

  // TODO 兼容以前版本的 defer 配置，后续需要移除
  api.addUmiExports(() => [
    {
      specifiers: ['qiankunStart'],
      source: utils.winPath('../plugin-qiankun/qiankunDefer'),
    },
  ]);

  api.addUmiExports(() => {
    const pinnedExport = 'MicroApp';
    const exports: any[] = [
      {
        specifiers: [pinnedExport],
        source: utils.winPath('../plugin-qiankun/MicroApp'),
      },
    ];

    const { exportComponentAlias } = api.config.qiankun.master!;
    // 存在别名导出时再导出一份别名
    if (exportComponentAlias && exportComponentAlias !== pinnedExport) {
      exports.push({
        specifiers: [{ local: pinnedExport, exported: exportComponentAlias }],
        source: utils.winPath('../plugin-qiankun/MicroApp'),
      });
    }

    return exports;
  });
}
