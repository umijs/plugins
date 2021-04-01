import React from 'react';
import { _DvaContainer, getApp, _onCreate } from './dva';

export function rootContainer(container) {
  return React.createElement(_DvaContainer, null, container);
}

{{#SSR}}
export const ssr = {
  modifyGetInitialPropsCtx: async (ctx) => {
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
    const { _store } = getApp();
    ctx.store = _store;
    return ctx;
  },
}
{{/SSR}}
