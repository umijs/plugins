/**
 * @author Kuitos
 * @since 2019-06-20
 */

import { ReactComponentElement } from 'react';
import type { IRouteProps } from '@umijs/types';

export const defaultMountContainerId = 'root-subapp';

// @formatter:off
export const noop = () => {};
// @formatter:on

// throw in dev env, log on prod
function logError(error: Error) {
  if (process.env.NODE_ENV === 'development') {
    throw error;
  } else {
    console.error(error);
  }
}

export function toArray<T>(source: T | T[]): T[] {
  return Array.isArray(source) ? source : [source];
}

function testPathWithStaticPrefix(pathPrefix: string, realPath: string) {
  if (pathPrefix.endsWith('/')) {
    return realPath.startsWith(pathPrefix);
  }

  const pathRegex = new RegExp(`^${pathPrefix}([/?])+.*$`, 'g');
  const normalizedPath = `${realPath}/`;
  return pathRegex.test(normalizedPath);
}

function testPathWithDynamicRoute(dynamicRoute: string, realPath: string) {
  // FIXME 这个是旧的使用方式才会调到的 api，先临时这么苟一下消除报错，引导用户去迁移吧
  const pathToRegexp = require('path-to-regexp');
  return pathToRegexp(dynamicRoute, { strict: true, end: false }).test(
    realPath,
  );
}

export function testPathWithPrefix(pathPrefix: string, realPath: string) {
  return (
    testPathWithStaticPrefix(pathPrefix, realPath) ||
    testPathWithDynamicRoute(pathPrefix, realPath)
  );
}

export function patchMicroAppRoute(
  route: any,
  getMicroAppRouteComponent: (opts: {
    appName: string;
    base: string;
    masterHistoryType: string;
    routeProps?: any;
  }) => string | ReactComponentElement<any>,
  masterOptions: {
    base: string;
    masterHistoryType: string;
    routeBindingAlias: string;
  },
) {
  const { base, masterHistoryType, routeBindingAlias } = masterOptions;
  // 当配置了 routeBindingAlias 时，优先从 routeBindingAlias 里取配置，但同时也兼容使用了默认的 microApp 方式
  const microAppName = route[routeBindingAlias] || route.microApp;
  const microAppProps =
    route[`${routeBindingAlias}Props`] || route.microAppProps || {};
  if (microAppName) {
    if (route.routes?.length) {
      const childrenRouteHasComponent = route.routes.some(
        (r: any) => r.component,
      );
      if (childrenRouteHasComponent) {
        throw new Error(
          `[@umijs/plugin-qiankun]: You can not attach micro app ${microAppName} to route ${route.path} whose children has own component!`,
        );
      }
    }

    route.exact = false;

    const { settings = {}, ...componentProps } = microAppProps;
    const routeProps = {
      // 兼容以前的 settings 配置
      settings: route.settings || settings || {},
      ...componentProps,
    };
    const opts = {
      appName: microAppName,
      base,
      masterHistoryType,
      routeProps,
    };
    route.component = getMicroAppRouteComponent(opts);
  }
}

// insert route with "insert" attribute into the route tree
export function insertMicroAppRoute({ routes }: { routes: IRouteProps[] }) {
  const insertedArray: IRouteProps[] = [];

  // count total number of current route tree
  const countRoute = () => {
    let count = 0;
    const recursiveCount = (routes: IRouteProps[]) => {
      for (let i = 0; i < routes.length; i++) {
        count += 1;
        if (routes[i].routes && routes[i].routes?.length) {
          recursiveCount(routes[i].routes || []);
        }
      }
    };
    recursiveCount(routes);
    return count;
  };

  // traverse the route tree to splice all routes that need to be inserted
  const traverse = (routes: IRouteProps[]) => {
    if (routes.length) {
      for (let i = 0; i < routes.length; i++) {
        const route = routes[i];

        if (route.insert && route.insert !== '/') {
          const [toBeMovedRoute] = routes.splice(i, 1);
          insertedArray.push(toBeMovedRoute);
          i -= 1;
        }

        if (route.routes?.length) {
          traverse(route.routes);
        }
      }
    }
  };

  const originalRouteCount = countRoute();

  traverse(routes);

  // find parent node in route tree
  const recursiveSearch = (
    routes: IRouteProps[],
    path: string,
  ): IRouteProps | null => {
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].path === path) {
        return routes[i];
      }
      if (routes[i].routes && routes[i].routes?.length) {
        const found = recursiveSearch(routes[i].routes || [], path);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  insertedArray.forEach((item) => {
    if (!item.path || !item.path.startsWith(item.insert)) {
      logError(
        new Error(
          `[insert-routes]: path "${item.path}" need to starts with "${item.insert}"`,
        ),
      );
    }
    let found = recursiveSearch(routes, item.insert);
    // possiablly a nested child of inserted item
    if (!found) {
      found = recursiveSearch(insertedArray, item.insert);
    }
    if (found) {
      found.routes = found.routes || [];
      found.routes.push(item);
      found.exact = false;
    } else {
      logError(
        new Error(
          `[insert-routes]: insert route not found for "${item.insert}"`,
        ),
      );
    }
  });

  const patchedRouteCount = countRoute();

  // check if any route lost while the insertion
  if (patchedRouteCount < originalRouteCount) {
    logError(new Error(`[insert-routes]: circular route insert detected`));
  }
}
