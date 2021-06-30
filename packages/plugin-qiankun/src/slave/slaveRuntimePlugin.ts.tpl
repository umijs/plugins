import React from 'react';
import qiankunRender, { clientRenderOptsStack } from './lifecycles';
import { Context } from '@@/plugin-qiankun/qiankunContext';

export function rootContainer(container: HTMLElement) {
  const value =
    typeof window !== 'undefined' ? (window as any).g_rootExports : {};
  // eslint-disable-next-line global-require
  return React.createElement(Context.Provider, { value }, container);
}

export const render = (oldRender: any) => {
  return qiankunRender().then(oldRender);
};

export function modifyClientRenderOpts(memo: any) {
  // 每次应用 render 的时候会调 modifyClientRenderOpts，这时尝试从队列中取 render 的配置
  const clientRenderOpts = clientRenderOptsStack.shift();
  if (clientRenderOpts) {
    const history = clientRenderOpts.getHistory();
    delete clientRenderOpts.getHistory;
    clientRenderOpts.history = history;
  }

  return {
    ...memo,
    ...clientRenderOpts,
  };
}
