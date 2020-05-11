import React from 'react';
import { _DvaContainer, getApp, _onCreate } from './dva';

export function rootContainer(container) {
  return React.createElement(_DvaContainer, null, container);
}

{{#SSR}}
export const ssr = {
  modifyGetInitialPropsCtx: (ctx) => {
    // 服务端执行早于 constructor 中的 onCreate
    if (process.env.__IS_SERVER && ctx.history) {
      const tmpApp = _onCreate({
        // server
        history: ctx.history,
      })
      tmpApp.router(() => {})
      tmpApp.start();
    }
    // 一定有 app
    const { _store } = getApp() || {};
    return {
      ...ctx,
      store: _store,
    };
  },
  modifyInitialProps: async (initialProps) => {
    if (initialProps) {
      return initialProps;
    }
    // server 端 initialState
    const { _store } = getApp() || {};
    if (_store && _store.getState) {
      const state = _store.getState();
      return Object.keys(state || {}).reduce((memo, key) => {
        if (!['@@dva', 'loading', 'routing'].includes(key)) {
          memo[key] = state[key];
        }
        return memo;
      }, {});
    }
    return {};
  },
}
{{/SSR}}
