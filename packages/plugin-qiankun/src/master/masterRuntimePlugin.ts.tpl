/* eslint-disable import/no-unresolved, import/extensions */

import '@@/plugin-qiankun/qiankunRootExports.js';
import { IRouteProps, BaseIConfig } from '@umijs/types';
import assert from 'assert';
import { prefetchApps, registerMicroApps, start } from '{{{ qiankunPath }}}';
// @ts-ignore
import { ApplyPluginsType, getMicroAppRouteComponent, plugin } from 'umi';

import { defaultMountContainerId, insertRoute, noop, patchMicroAppRoute, testPathWithPrefix, toArray } from './common';
import { defaultHistoryType } from './constants';
import { getMasterOptions, setMasterOptions } from './masterOptions';
// @ts-ignore
import { deferred } from './qiankunDefer.js';
import { App, HistoryType, MasterOptions, MicroAppRoute } from './types';

let microAppRuntimeRoutes: MicroAppRoute[];

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

// modify route with "microApp" attribute to use real component
function patchMicroAppRouteComponent(routes: IRouteProps[]) {
  const insertRoutes = microAppRuntimeRoutes.filter(r => r.insert || r.insertBefore || r.appendChildTo);
  // 先处理 insert 配置
  insertRoutes.forEach(route => {
    insertRoute(routes, route);
  });

  const getRootRoutes = (routes: IRouteProps[]) => {
    const rootRoute = routes.find(route => route.path === '/');
    if (rootRoute) {
      // 如果根路由是叶子节点，则直接返回其父节点
      if (!rootRoute.routes) {
        return routes;
      }

      return getRootRoutes(rootRoute.routes);
    }

    return routes;
  };

  const rootRoutes = getRootRoutes(routes);
  if (rootRoutes) {
    const { routeBindingAlias, base, masterHistoryType } = getMasterOptions() as MasterOptions;
    microAppRuntimeRoutes.reverse().forEach(microAppRoute => {
      const patchRoute = (route: IRouteProps) => {
        patchMicroAppRoute(route, getMicroAppRouteComponent, { base, masterHistoryType, routeBindingAlias });
        if (route.routes?.length) {
          route.routes.forEach(patchRoute);
        }
      };

      patchRoute(microAppRoute);
      if (!microAppRoute.insert && !microAppRoute.insertBefore && !microAppRoute.appendChildTo) {
        rootRoutes.unshift(microAppRoute);
      }
    });
  }
}

export async function render(oldRender: typeof noop) {
  const runtimeOptions = await getMasterRuntime();
  let masterOptions: MasterOptions = { ...getMasterOptions(), ...runtimeOptions };

  const masterApps = masterOptions.apps || [];
  const credentialsApps = masterApps.filter(app => app.credentials);
  if (credentialsApps.length) {
    const defaultFetch = masterOptions.fetch || window.fetch;
    const fetchWithCredentials = (url: string, init?: RequestInit) => {
      // 如果当前 url 为 credentials 应用的 entry，则为其加上 cors 相关配置
      if (credentialsApps.some(app => app.entry === url)) {
        return defaultFetch(url, {
          ...init,
          mode: 'cors',
          credentials: 'include',
        });
      }

      return defaultFetch(url, init);
    };

    // 设置新的 fetch
    masterOptions = { ...masterOptions, fetch: fetchWithCredentials };
  }

  const extraQiankunConfigNode = document.querySelector(
    'script[type=extra-qiankun-config]:not([consumed])',
  );
  const extraQiankunConfigJSON: string | undefined = extraQiankunConfigNode?.innerHTML;
  const extraQiankunConfig: BaseIConfig | undefined = extraQiankunConfigJSON && JSON.parse(extraQiankunConfigJSON);
  if (extraQiankunConfig) {
    masterOptions = mergeExtraQiankunConfig(masterOptions, extraQiankunConfig);
    extraQiankunConfigNode.setAttribute('consumed', '');
  }

  // 更新 master options
  setMasterOptions(masterOptions);

  const { apps = [], routes, ...options } = getMasterOptions();
  microAppRuntimeRoutes = routes;

  // 检查是否因为用户本地的配置的 app ，导致 app 冲突
  checkDuplicateApps(apps);

  // 主应用相关的配置注册完毕后即可开启渲染
  oldRender();

  // 未使用 base 配置的可以认为是路由关联或者使用标签装载的应用
  const loadableApps = apps.filter(app => !app.base);
  if (loadableApps.length) {
    const { prefetch, ...importEntryOpts } = options;
    if (prefetch === 'all') {
      prefetchApps(loadableApps, importEntryOpts);
    } else if (Array.isArray(prefetch)) {
      const specialPrefetchApps = loadableApps.filter(app => prefetch.indexOf(app.name) !== -1);
      prefetchApps(specialPrefetchApps, importEntryOpts);
    }
  }

  // 使用了 base 配置的应用为可注册应用
  const registrableApps = apps.filter(app => app.base);
  if (registrableApps.length) {
    // 不要在 oldRender 调用之前调用 useRegisterMode 方法，因为里面可能会 await defer promise 从而造成死锁
    await useLegacyRegisterMode(registrableApps, options);
  }
}

export function patchRoutes({ routes }: { routes: IRouteProps[] }) {
  if (microAppRuntimeRoutes) {
    patchMicroAppRouteComponent(routes);
  }
}

function checkDuplicateApps(apps: App[]) {
  const appsNameSet = new Set<String>();
  for (const { name } of apps) {
    if (appsNameSet.has(name)) {
      console.warn(
        `[@umijs/plugin-qiankun]: Encountered two microApps with the same name ${name}. Your current apps configuration is :\n${JSON.stringify(apps, null, 2)}`,
      );
    } else {
      appsNameSet.add(name);
    }
  }
}

function mergeExtraQiankunConfig(masterOptions: MasterOptions, extraQiankunConfig: BaseIConfig): BaseIConfig {
  function removeDuplicateApps(apps = new Array<App>(), extraAppsNameSet?: Set<string>): App[] {
    let _extraAppsNameSet = extraAppsNameSet || new Set<string>(
      apps.filter(({ extraSource }) => extraSource).map(({ name }) => name),
    );

    const newApps = apps.filter(app => {
      const { name } = app;

      if (!app.extraSource && _extraAppsNameSet.has(name)) {
        console.error(
          `[@umijs/plugin-qiankun]: Encountered two microApps with the same appName, ${name}. The original app configuration has been overwritten by current app.`,
        );

        return false;
      }

      return true;
    });

    return newApps;
  }
  const {
    apps: originalMasterApps = [],
    routes: originalMasterRoutes = [],
    ...othersOriginalMasterConfig
  } = masterOptions ?? {};
  const {
    apps = [],
    routes = [],
    prefetch,
    ...othersConfig
  } = extraQiankunConfig.master as MasterOptions;

  const mergedApps = [...originalMasterApps, ...apps];
  const mergedRoutes = [...originalMasterRoutes, ...routes];

  const mergedQiankunMasterConfig: MasterOptions = {
    ...othersOriginalMasterConfig,
    ...othersConfig,
    apps: removeDuplicateApps(mergedApps),
    routes: mergedRoutes,
  };

  if (prefetch !== undefined) {
    mergedQiankunMasterConfig.prefetch = prefetch;
  }

  return mergedQiankunMasterConfig;
}

async function useLegacyRegisterMode(
  apps: App[],
  masterOptions: Omit<MasterOptions, 'apps'>,
) {
  if (process.env.NODE_ENV === 'development') {
    console.error(
      '[@umijs/plugin-qiankun] Deprecated: 检测到还在使用旧版配置，该配置将在后续版本中移除，请尽快升级到最新配置方式以获得更好的开发体验，详见 https://umijs.org/plugins/plugin-qiankun#%E5%8D%87%E7%BA%A7%E6%8C%87%E5%8D%97',
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
        '[@umijs/plugin-qiankun] Deprecated: defer 配置不再推荐，并将在后续版本中移除，请尽快升级到最新配置方式以获得更好的开发体验，详见 https://umijs.org/plugins/plugin-qiankun#%E5%8D%87%E7%BA%A7%E6%8C%87%E5%8D%97',
      );
    }
    await deferred.promise;
  }

  start({ sandbox, prefetch, ...otherConfigs });
}
