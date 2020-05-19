import React from 'react';
import { InitialState, request as umiRequest, SelectLang } from 'umi';
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
  rightRender: (initialState: any, setInitialState: any) => {
    console.log('initialState', initialState);
    return (
      <>
        <SelectLang
          postLocalesData={locales => [
            ...locales,
            {
              lang: 'nl-NL', // 荷兰语的 key 与 antd 保持一致
              label: 'Nederlands', // 荷兰语的“荷兰语”
              icon: '🇳🇱', // 荷兰国旗
              title: 'Taal', // 荷兰语的“语言”
            },
          ]}
          onItemClick={({ key }) => alert(key)}
        />
        <button
          onClick={() => {
            setInitialState({ name: 'SS' });
          }}
        >
          {initialState.name}
        </button>
      </>
    );
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
