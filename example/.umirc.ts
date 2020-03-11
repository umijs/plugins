import { defineConfig } from 'umi';

export default defineConfig({
  presets: [require.resolve('../packages/preset-react/lib')],
  // plugins: [require.resolve('../packages/plugin-webpack-5/lib')],
  routes: [
    {
      name: 'model 测试',
      path: '/plugin-model',
      icon: 'home',
      component: './plugin-model',
    },
    {
      name: 'initial-state 测试',
      icon: 'heart',
      path: '/plugin-initial-state',
      component: './plugin-initial-state',
    },
    {
      name: 'utils 测试',
      path: '/utils',
      component: './utils',
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
