import { IApi, IRoute } from 'umi';
import { patchMicroAppRoute, testPathWithPrefix, toArray } from '../common';
import { defaultHistoryType } from '../constants';
import { App } from '../types';

export default function modifyRoutes(api: IApi) {
  api.modifyRoutes((routes) => {
    const { history, base } = api.config;
    const { master: { routeBindingAlias = 'microApp', apps = [] } = {} } =
      api.config.qiankun || {};
    const masterHistoryType = (history && history?.type) || defaultHistoryType;

    // 兼容以前的通过配置 base 自动注册应用的场景
    const registrableApps = apps.filter((app: App) => app.base);
    if (registrableApps.length) {
      useLegacyModifyRoutesWithRegistrableMode(
        routes,
        registrableApps,
        masterHistoryType,
      );
    }

    modifyRoutesWithAttachMode(routes, masterHistoryType, {
      routeBindingAlias,
      base: base || '/',
    });

    return routes;
  });
}

function modifyRoutesWithAttachMode(
  routes: IRoute[],
  masterHistoryType: string,
  opts: {
    routeBindingAlias?: string;
    base?: string;
  },
) {
  const { routeBindingAlias = 'microApp', base = '/' } = opts;
  const patchRoutes = (routes: IRoute[]) => {
    if (routes.length) {
      const getMicroAppRouteComponent = (opts: {
        appName: string;
        base: string;
        masterHistoryType: string;
        routeProps?: any;
      }) => {
        const { base, masterHistoryType, appName, routeProps } = opts;
        const normalizeJsonStringInUmiRoute = (str: string) =>
          str.replace(/"/g, "'");
        const normalizedRouteProps = normalizeJsonStringInUmiRoute(
          JSON.stringify(routeProps),
        );

        return `(() => {
          const { getMicroAppRouteComponent } = umiExports;
          return getMicroAppRouteComponent({ appName: '${appName}', base: '${base}', masterHistoryType: '${masterHistoryType}', routeProps: ${normalizedRouteProps} })
        })()`;
      };

      routes.forEach((route) => {
        patchMicroAppRoute(route, getMicroAppRouteComponent, {
          base,
          masterHistoryType,
          routeBindingAlias,
        });

        if (route.routes?.length) {
          patchRoutes(route.routes);
        }
      });
    }
  };

  patchRoutes(routes);

  return routes;
}

/**
 * 1.x 版本使用 base 配置加载微应用的方式
 * @param routes
 * @param apps
 * @param masterHistoryType
 */
function useLegacyModifyRoutesWithRegistrableMode(
  routes: IRoute[],
  apps: App[],
  masterHistoryType: string,
) {
  // 获取一组路由中以 basePath 为前缀的路由
  const findRouteWithPrefix = (
    routes: IRoute[],
    basePath: string,
  ): IRoute | null => {
    // eslint-disable-next-line no-restricted-syntax
    for (const route of routes) {
      if (route.path && testPathWithPrefix(basePath, route.path)) return route;

      if (route.routes && route.routes.length) {
        return findRouteWithPrefix(route.routes, basePath);
      }
    }

    return null;
  };

  return routes.map((route) => {
    if (route.path === '/' && route.routes && route.routes.length) {
      apps.forEach(({ history: slaveHistory = masterHistoryType, base }) => {
        if (!base) {
          return;
        }

        // 当子应用的 history mode 跟主应用一致时，为避免出现 404 手动为主应用创建一个 path 为 子应用 rule 的空 div 路由组件
        if (slaveHistory === masterHistoryType) {
          const baseConfig = toArray(base);

          baseConfig.forEach((basePath) => {
            const routeWithPrefix = findRouteWithPrefix(routes, basePath);

            // 应用没有自己配置过 basePath 相关路由，则自动加入 mock 的路由
            if (!routeWithPrefix) {
              route.routes!.unshift({
                path: basePath,
                exact: false,
                component: `() => {
                        if (process.env.NODE_ENV === 'development') {
                          console.log('${basePath} 404 mock rendered');
                        }

                        const React = require('react');
                        return React.createElement('div');
                      }`,
              });
            } else {
              // 若用户已配置过跟应用 base 重名的路由，则强制将该路由 exact 设置为 false，目的是兼容之前遗留的错误用法的场景
              routeWithPrefix.exact = false;
            }
          });
        }
      });
    }

    return route;
  });
}
