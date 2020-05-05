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
  const config = await plugin.applyPlugins({
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
          testPathWithPrefix(pathPrefix, location.pathname),
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

  const runtimeConfig = await getMasterRuntime();
  const {
    apps,
    jsSandbox = false,
    prefetch = true,
    defer = false,
    lifeCycles,
    masterHistoryType = defaultHistoryType,
    ...otherConfigs
  } = {
    ...(subAppConfig as MasterOptions),
    ...(runtimeConfig as MasterOptions),
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
          render: ({ appContent, loading }) => {
            if (process.env.NODE_ENV === 'development') {
              console.info(
                `[@umijs/plugin-qiankun]: app ${name} loading ${loading}`,
              );
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
            } else if (process.env.NODE_ENV === 'development') {
              console.warn(`[@umijs/plugin-qiankun]: Your ${name} app container with id ${mountElementId} is not
               ready, that may cause an unexpected behavior!`);
            }
          },
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
    otherConfigs,
  );

  if (defer) {
    await deferred.promise;
  }

  start({ jsSandbox, prefetch, ...otherConfigs });
}
