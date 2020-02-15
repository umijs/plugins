import { defineConfig } from 'umi';

export default defineConfig({
  routes: [
    {
      name: 'model 测试',
      path: '/plugin-model',
      component: './plugin-model',
    },
    {
      name: 'initial-state 测试',
      path: '/plugin-initial-state',
      component: './plugin-initial-state',
    },
    {
      name: '首页',
      path: '/',
      component: './index',
    },
  ],
  plugins: [
    require.resolve('../packages/plugin-antd/lib'),
    require.resolve('../packages/plugin-locale/lib'),
    require.resolve('../packages/plugin-dva/lib'),
    require.resolve('../packages/plugin-initial-state/lib'),
    require.resolve('../packages/plugin-model/lib'),
    require.resolve('../packages/plugin-request/lib'),
    // require.resolve('../packages/plugin-layout/lib'),
  ],
});
