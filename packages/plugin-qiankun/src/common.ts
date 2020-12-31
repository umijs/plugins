/**
 * @author Kuitos
 * @since 2019-06-20
 */

import * as pathToRegexp from 'path-to-regexp';

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

  const pathRegex = new RegExp(`^${pathPrefix}(\\/|\\?)+.*$`, 'g');
  const normalizedPath = `${realPath}/`;
  return pathRegex.test(normalizedPath);
}

function testPathWithDynamicRoute(dynamicRoute: string, realPath: string) {
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
  runtime = false,
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
    // 兼容以前的 settings 配置
    const microAppSettings = route.settings || settings || {};

    const normalizeJsonStringInUmiRoute = (str: string) =>
      str.replace(/\"/g, "'");
    const routeProps = runtime
      ? {
          settings: microAppSettings,
          ...componentProps,
        }
      : normalizeJsonStringInUmiRoute(
          JSON.stringify({
            settings: microAppSettings,
            ...componentProps,
          }),
        );

    const opts = {
      appName: microAppName,
      base,
      masterHistoryType,
      routeProps,
    };
    // 如果是运行时则返回真实的函数引用，编译时则返回字符串
    route.component = runtime
      ? getMicroAppRouteComponent(opts)
      : getMicroAppRouteComponentStr(opts);
  }
}

export function getMicroAppRouteComponent(opts: {
  appName: string;
  base: string;
  masterHistoryType: string;
  routeProps?: any;
}) {
  const { base, masterHistoryType, appName, routeProps } = opts;
  const RouteComponent = ({ match }: any) => {
    const {
      MicroApp,
      getCreateHistoryOptions,
    } = require('@@/core/umiExports') as any;
    const { url } = match;

    // 默认取静态配置的 base
    let umiConfigBase = base === '/' ? '' : base;
    // 存在 getCreateHistoryOptions 说明当前应用开启了 runtimeHistory，此时取运行时的 history 配置的 basename
    if (typeof getCreateHistoryOptions === 'function') {
      const { basename = '/' } = getCreateHistoryOptions();
      umiConfigBase = basename === '/' ? '' : basename;
    }

    const runtimeMatchedBase =
      umiConfigBase + (url.endsWith('/') ? url.substr(0, url.length - 1) : url);

    const React = require('react');
    const componentProps = {
      name: appName,
      base: runtimeMatchedBase,
      history: masterHistoryType,
      ...routeProps,
    };
    return React.createElement(MicroApp, componentProps);
  };

  return RouteComponent;
}

function getMicroAppRouteComponentStr(opts: {
  appName: string;
  base: string;
  masterHistoryType: string;
  routeProps?: any;
}) {
  const { base, masterHistoryType, appName, routeProps } = opts;
  return `(() => {
    const getMicroAppRouteComponent = require('@@/plugin-qiankun/common').getMicroAppRouteComponent;
    return getMicroAppRouteComponent({ appName: '${appName}', base: '${base}', masterHistoryType: '${masterHistoryType}', routeProps: ${routeProps} })
  })()`;
}
