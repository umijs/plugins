import { defineConfig } from 'umi';

export default defineConfig({
  presets: [require.resolve('../packages/preset-react/lib')],
  // plugins: [require.resolve('../packages/plugin-webpack-5/lib')],
  routes: [
    {
      name: 'model 测试',
      path: '/plugin-model',
      component: './plugin-model',
      icon: 'smile',
    },
    {
      name: 'initial-state 测试',
      path: '/plugin-initial-state',
      component: './plugin-initial-state',
      icon: 'star',
    },
    {
      name: 'utils 测试',
      path: '/utils',
      component: './utils',
    },
    {
      name: 'request 测试',
      path: '/request',
      component: './request',
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
});
