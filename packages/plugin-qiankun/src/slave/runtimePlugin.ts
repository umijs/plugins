import React from 'react';
import qiankunRender from './lifecycles';

export function rootContainer(container: HTMLElement) {
  const value = (window as any).g_rootExports;
  // eslint-disable-next-line global-require
  const { Context } = require('@/.umi/qiankunContext');
  return React.createElement(Context.Provider, { value }, container);
}

export const render = (oldRender: any) => {
  return qiankunRender().then(() => {
    oldRender();
  });
};
