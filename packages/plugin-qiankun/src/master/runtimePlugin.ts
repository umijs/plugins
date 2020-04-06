/* eslint-disable import/no-unresolved, import/extensions */

// @ts-ignore
import { deferred } from '@@/plugin-qiankun/qiankunDefer.js';
import '@@/plugin-qiankun/qiankunRootExports.js';
// @ts-ignore
import subAppConfig from '@@/plugin-qiankun/subAppsConfig.json';
import assert from 'assert';
import { registerMicroApps, start } from 'qiankun';
import React from 'react';
import ReactDOM from 'react-dom';
// @ts-ignore
import { IConfig, plugin, ApplyPluginsType } from 'umi';
import {
  defaultMountContainerId,
  noop,
  testPathWithPrefix,
  toArray,
} from '../common';
import { App, Options } from '../types';

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

export async function render(oldRender: typeof noop) {
  oldRender();

  function isAppActive(
    location: Location,
    history: IConfig['history'],
    base: App['base'],
  ) {
    const baseConfig = toArray(base);

    // @ts-ignore TODO，umi 的 type 定义现在有问题
    switch (history.type || history) {
      case 'hash':
        return baseConfig.some(pathPrefix =>
          testPathWithPrefix(`#${pathPrefix}`, location.hash),
        );

      case 'browser':
        return baseConfig.some(pathPrefix =>
          testPathWithPrefix(pathPrefix, location.pathname),
        );

      default:
        return false;
    }
  }

  const runtimeConfig = await getMasterRuntime();
  const {
    apps,
    jsSandbox = false,
    prefetch = true,
    defer = false,
    lifeCycles,
    masterHistory,
    ...otherConfigs
  } = {
    ...(subAppConfig as Options),
    ...(runtimeConfig as Options),
  };
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
        history = masterHistory,
        mountElementId = defaultMountContainerId,
        props,
      }) => ({
        name,
        entry,
        activeRule: location => isAppActive(location, history, base),
        render: ({ appContent, loading }) => {
          if (process.env.NODE_ENV === 'development') {
            console.info(`app ${name} loading ${loading}`);
          }

          if (mountElementId) {
            const container = document.getElementById(mountElementId);
            if (container) {
              const subApp = React.createElement('div', {
                dangerouslySetInnerHTML: {
                  __html: appContent,
                },
              });
              ReactDOM.render(subApp, container);
            }
          }
        },
        props: {
          base,
          history,
          ...props,
        },
      }),
    ),
    lifeCycles,
    otherConfigs,
  );

  if (defer) {
    await deferred.promise;
  }

  start({ jsSandbox, prefetch, ...otherConfigs });
}
