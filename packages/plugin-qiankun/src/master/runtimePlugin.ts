/* eslint-disable import/no-unresolved, import/extensions */

import {
  getMasterOptions,
  setMasterOptions,
} from '@@/plugin-qiankun/masterOptions';
import { deferred } from '@@/plugin-qiankun/qiankunDefer.js';
import '@@/plugin-qiankun/qiankunRootExports.js';
import assert from 'assert';
import { prefetchApps, registerMicroApps, start } from 'qiankun';
// @ts-ignore
import { ApplyPluginsType, plugin } from 'umi';
import {
  defaultHistoryType,
  defaultMountContainerId,
  noop,
  testPathWithPrefix,
  toArray,
} from '../common';
import { App, HistoryType, MasterOptions } from '../types';

async function getMasterRuntime() {
  const config = plugin.applyPlugins({
    key: 'qiankun',
    type: ApplyPluginsType.modify,
    initialValue: {},
    async: true,
  });
  const { master } = config;
  return master || config;
}

async function useRegisterMode(
  apps: App[],
  masterOptions: Omit<MasterOptions, 'apps'>,
) {
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
    await deferred.promise;
  }

  start({ sandbox, prefetch, ...otherConfigs });
}

export async function render(oldRender: typeof noop) {
  const masterOptions = getMasterOptions();
  const runtimeOptions = await getMasterRuntime();

  setMasterOptions({ ...masterOptions, ...runtimeOptions });
  // 主应用相关的配置注册完毕后即可开启渲染
  oldRender();

  const { apps, ...options } = getMasterOptions() as MasterOptions;

  // 使用了 base 配置的应用为可注册应用
  const registrableApps = apps.filter(app => app.base);
  if (registrableApps.length) {
    // 不要在 oldRender 调用之前调用 useRegisterMode 方法，因为里面可能会 await defer promise 从而造成死锁
    await useRegisterMode(registrableApps, options);
  }

  // 未使用 base 配置的可以认为是路由关联或者使用标签装载的应用
  const loadableApps = apps.filter(app => !app.base);
  if (loadableApps.length) {
    const { prefetch, ...importEntryOpts } = options;
    if (prefetch) prefetchApps(loadableApps, importEntryOpts);
  }
}
