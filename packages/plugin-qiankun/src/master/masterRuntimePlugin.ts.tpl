/* eslint-disable import/no-unresolved, import/extensions */

import '@@/plugin-qiankun/qiankunRootExports.js';
import { IRouteProps } from '@umijs/types';
import assert from 'assert';
import { prefetchApps, registerMicroApps, start } from 'qiankun';
// @ts-ignore
import { ApplyPluginsType, plugin } from 'umi';

import { defaultMountContainerId, noop, patchMicroAppRoute, testPathWithPrefix, toArray } from './common';
import { defaultHistoryType } from './constants';
import { getMasterOptions, setMasterOptions } from './masterOptions';
// @ts-ignore
import { deferred } from './qiankunDefer.js';
import { App, HistoryType, MasterOptions, MicroAppRoute } from './types';

async function getMasterRuntime() {
  const config = await plugin.applyPlugins({
    key: 'qiankun',
    type: ApplyPluginsType.modify,
    initialValue: {},
    async: true,
  });
  const { master } = config;
  return master || config;
}

let microAppRuntimeRoutes: MicroAppRoute[];

export async function render(oldRender: typeof noop) {
  const masterOptions = getMasterOptions();
  const runtimeOptions = await getMasterRuntime();

  setMasterOptions({ ...masterOptions, ...runtimeOptions });
  const { apps, routes, ...options } = getMasterOptions() as MasterOptions;
  microAppRuntimeRoutes = routes;

  // 主应用相关的配置注册完毕后即可开启渲染
  oldRender();

  // 使用了 base 配置的应用为可注册应用
  const registrableApps = apps.filter(app => app.base);
  if (registrableApps.length) {
    // 不要在 oldRender 调用之前调用 useRegisterMode 方法，因为里面可能会 await defer promise 从而造成死锁
    await useLegacyRegisterMode(registrableApps, options);
  }

  // 未使用 base 配置的可以认为是路由关联或者使用标签装载的应用
  const loadableApps = apps.filter(app => !app.base);
  if (loadableApps.length) {
    const { prefetch, ...importEntryOpts } = options;
    if (prefetch) prefetchApps(loadableApps, importEntryOpts);
  }
}

export function patchRoutes(opts: { routes: IRouteProps[] }) {
  if (microAppRuntimeRoutes) {
    const getRootRoutes = (routes: IRouteProps[]) => {
      const rootRoute = routes.find(route => route.path === '/');
      if (rootRoute) {
        if (!rootRoute.routes) {
          rootRoute.routes = [];
        }
        return rootRoute.routes;
      }

      return routes;
    };

    const { routes } = opts;
    const rootRoutes = getRootRoutes(routes);
    if (rootRoutes) {
      const { routeBindingAlias, base, masterHistoryType } = getMasterOptions() as MasterOptions;
      microAppRuntimeRoutes.reverse().forEach(microAppRoute => {
        patchMicroAppRoute(microAppRoute, true, { base, masterHistoryType, routeBindingAlias });
        rootRoutes.unshift(microAppRoute);
      });
    }
  }
}

async function useLegacyRegisterMode(
  apps: App[],
  masterOptions: Omit<MasterOptions, 'apps'>,
) {
  if (process.env.NODE_ENV === 'development') {
    console.error(
      '[@umijs/plugin-qiankun] Deprecated: 检测到还在使用旧版配置，建议您升级到最新配置方式以获得更好的开发体验，详见 https://umijs.org/plugins/plugin-qiankun#%E5%8D%87%E7%BA%A7%E6%8C%87%E5%8D%97',
    );
  }

  function isAppActive(
    location: Location,
    history: HistoryType,
    opts: { base: App['base']; setMatchedBase: (v: string) => void },
  ) {
    const { base, setMatchedBase } = opts;
    const baseConfig = toArray(base);

    switch (history) {
      case 'hash': {
        const matchedBase = baseConfig.find(pathPrefix =>
          testPathWithPrefix(`#${pathPrefix}`, location.hash),
        );
        if (matchedBase) {
          setMatchedBase(matchedBase);
        }

        return !!matchedBase;
      }

      case 'browser': {
        const matchedBase = baseConfig.find(pathPrefix =>
          testPathWithPrefix(pathPrefix!, location.pathname),
        );
        if (matchedBase) {
          setMatchedBase(matchedBase);
        }

        return !!matchedBase;
      }

      default:
        return false;
    }
  }

  const {
    // @ts-ignore 兼容之前版本的 jsSandbox 配置
    sandbox = masterOptions.jsSandbox ?? true,
    prefetch = true,
    // @ts-ignore compatible with old configuration
    defer = false,
    lifeCycles,
    masterHistoryType = defaultHistoryType,
    ...otherConfigs
  } = masterOptions;

  assert(
    apps && apps.length,
    'sub apps must be config when using umi-plugin-qiankun',
  );

  registerMicroApps(
    apps.map(
      ({
         name,
         entry,
         base,
         history = masterHistoryType,
         mountElementId = defaultMountContainerId,
         props,
       }) => {
        let matchedBase = base;

        return {
          name,
          entry,
          activeRule: location =>
            isAppActive(location, history, {
              base,
              setMatchedBase: (v: string) => (matchedBase = v),
            }),
          container: `#${mountElementId}`,
          props: {
            base,
            history,
            getMatchedBase() {
              return matchedBase;
            },
            ...props,
          },
        };
      },
    ),
    lifeCycles,
  );

  if (defer) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        '[@umijs/plugin-qiankun] Deprecated: defer 配置不再推荐，建议您升级到最新配置方式以获得更好的开发体验，详见 https://umijs.org/plugins/plugin-qiankun#%E5%8D%87%E7%BA%A7%E6%8C%87%E5%8D%97',
      );
    }
    await deferred.promise;
  }

  start({ sandbox, prefetch, ...otherConfigs });
}
