import React from 'react';
import { InitialState, request as umiRequest } from 'umi';
import { MenuItem } from '@umijs/plugin-layout';

export function render(oldRender: Function) {
  oldRender();
}

export function getInitialState() {
  return {
    name: 'test',
  };
}

export const layout = {
  logout: () => {
    alert('退出登录成功');
  },
  patchMenus: (menus: MenuItem[], initialInfo: InitialState) => {
    if (initialInfo?.initialState?.name === 'test') {
      return [
        ...menus,
        {
          name: '自定义',
          path: 'https://bigfish.alipay.com/',
        },
      ];
    }
    return menus;
  },
  childrenRender: children => {
    return (
      <>
        {children}
        <div id="xxx"></div>
      </>
    );
  },
};

export const locale = {
  default: 'zh-CN',
};

console.log('get request', umiRequest);

export const request = {
  errorConfig: {
    adaptor(resData) {
      console.log('get resData', resData);
      return resData;
    },
  },
};
