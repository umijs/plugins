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
    alert('退出登陆成功');
  },
  patchMenus: (menus: any) => {
    return [
      ...menus,
      {
        name: '自定义',
        path: 'https://bigfish.alipay.com/',
      },
    ];
  },
};

export const locale = {
  default: 'zh-CN',
};
