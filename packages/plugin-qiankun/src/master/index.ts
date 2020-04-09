/* eslint-disable quotes */
import { existsSync } from 'fs';
import { join } from 'path';
// eslint-disable-next-line import/no-unresolved
import { IApi, IRoute } from 'umi';
import {
  defaultHistoryType,
  defaultMasterRootId,
  testPathWithPrefix,
  toArray,
} from '../common';
import { MasterOptions } from '../types';

export default function(api: IApi, options: MasterOptions) {
  api.addRuntimePlugin(() => require.resolve('./runtimePlugin'));

  api.modifyDefaultConfig(config => ({
    ...config,
    mountElementId: defaultMasterRootId,
    disableGlobalVariables: true,
  }));

  // apps 可能在构建期为空
  const { apps = [] } = options || {};
  if (apps.length) {
    // 获取一组路由中以 basePath 为前缀的路由
    const findRouteWithPrefix = (
      routes: IRoute[],
      basePath: string,
    ): IRoute | null => {
      // eslint-disable-next-line no-restricted-syntax
      for (const route of routes) {
        if (route.path && testPathWithPrefix(basePath, route.path))
          return route;

        if (route.routes && route.routes.length) {
          return findRouteWithPrefix(route.routes, basePath);
        }
      }

      return null;
    };

    const modifyAppRoutes = () => {
      api.modifyRoutes(routes => {
        const {
          config: { history },
        } = api;

        const masterHistoryType = history?.type || defaultHistoryType;
        const newRoutes = routes.map(route => {
          if (route.path === '/' && route.routes && route.routes.length) {
            apps.forEach(
              ({ history: slaveHistory = masterHistoryType, base }) => {
                // 当子应用的 history mode 跟主应用一致时，为避免出现 404 手动为主应用创建一个 path 为 子应用 rule 的空 div 路由组件
                if (slaveHistory === masterHistoryType) {
                  const baseConfig = toArray(base);

                  baseConfig.forEach(basePath => {
                    const routeWithPrefix = findRouteWithPrefix(
                      routes,
                      basePath,
                    );

                    // 应用没有自己配置过 basePath 相关路由，则自动加入 mock 的路由
                    if (!routeWithPrefix) {
                      route.routes!.unshift({
                        path: basePath,
                        exact: false,
                        component: `() => {
                        if (process.env.NODE_ENV === 'development') {
                          console.log('${basePath} 404 mock rendered');
                        }

                        return require('react').createElement('div');
                      }`,
                      });
                    } else {
                      // 若用户已配置过跟应用 base 重名的路由，则强制将该路由 exact 设置为 false，目的是兼容之前遗留的错误用法的场景
                      routeWithPrefix.exact = false;
                    }
                  });
                }
              },
            );
          }

          return route;
        });

        return newRoutes;
      });
    };

    modifyAppRoutes();
  }

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
      path: 'plugin-qiankun/subAppsConfig.json',
      content: JSON.stringify({
        masterHistoryType,
        ...options,
      }),
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
  });

  api.addUmiExports(() => [
    {
      specifiers: ['qiankunStart'],
      source: '../plugin-qiankun/qiankunDefer',
    },
  ]);
}
