import { defineConfig } from 'umi';

export default defineConfig({
  presets: [
    require.resolve('../packages/preset-react/lib'),
    // require.resolve('../packages/plugin-esbuild'),
  ],
  plugins: [
    require.resolve('../packages/plugin-esbuild/lib'),
    require.resolve('../packages/plugin-qiankun/lib'),
    require.resolve('../packages/plugin-antd-dayjs/lib'),
  ],
  routes: [
    {
      name: 'model 测试',
      path: '/plugin-model',
      component: './plugin-model',
      icon: 'smile',
    },
    {
      name: 'qiankun 测试',
      path: '/plugin-qiankun',
      component: './plugin-qiankun',
      icon: 'setting',
    },
    {
      name: 'initial-state 测试',
      path: '/plugin-initial-state',
      component: './plugin-initial-state',
      icon: 'star',
    },
    {
      name: 'request 测试',
      path: '/request',
      component: './request',
      menu: false,
    },
    {
      name: 'access 测试（有权限）',
      path: '/plugin-access',
      component: './plugin-access',
      access: 'readArticle',
      menu: false,
    },
    {
      name: 'access 测试（没有权限）',
      path: '/plugin-no-access',
      component: './plugin-no-access',
      access: 'updateArticle',
      menu: false,
    },
    {
      name: 'locale 测试',
      path: '/plugin-locale',
      component: './plugin-locale',
    },
    {
      name: '首页',
      path: '/',
      component: './index',
    },
  ],
  locale: {},
  layout: {
    name: 'UMI 3',
  },
  antd: {
    config: {},
  },
  qiankun: {
    master: {
      apps: [
        {
          name: 'taobao',
          entry: 'https://taobao.com',
        },
      ],
    },
  },
});
