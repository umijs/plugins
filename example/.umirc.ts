import { defineConfig } from 'umi';

export default defineConfig({
  presets: [
    require.resolve('../packages/preset-react/lib'),
    // require.resolve('../packages/plugin-esbuild'),
  ],
  plugins: [require.resolve('../packages/plugin-esbuild/lib')],
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
});
