/**
 * @author Kuitos
 * @since 2019-06-20
 */

import { ReactComponentElement } from 'react';

export const defaultMountContainerId = 'root-subapp';

// @formatter:off
export const noop = () => {};
// @formatter:on

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
  return pathToRegexp
    .default(dynamicRoute, {
      strict: true,
      end: false,
    })
    .test(realPath);
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
      throw new Error(
        '[@umijs/plugin-qiankun]: You can not attach micro app to a route who has children!',
      );
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
