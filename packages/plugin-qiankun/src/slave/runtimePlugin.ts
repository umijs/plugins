import React from 'react';
import qiankunRender, { clientRenderOpts } from './lifecycles';

export function rootContainer(container: HTMLElement) {
  const value =
    typeof window !== 'undefined' ? (window as any).g_rootExports : {};
  // eslint-disable-next-line global-require
  const { Context } = require('@@/plugin-qiankun/qiankunContext');
  return React.createElement(Context.Provider, { value }, container);
}

export const render = (oldRender: any) => {
  return qiankunRender().then(oldRender);
};

export function modifyClientRenderOpts(memo: any) {
  return {
    ...memo,
    ...clientRenderOpts,
  };
}
