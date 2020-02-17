import { name } from './package';

export default {
  base: name,
  publicPath: '/app2/',
  outputPath: './dist/app2',
  mountElementId: 'app2',
  qiankun: {
    slave: {},
  },
  plugins: [
    require.resolve('../../../plugin-dva/lib'),
    require.resolve('../../../plugin-antd/lib'),
    require.resolve('../../../plugin-qiankun/lib'),
  ],
  // TODO 测试约定式路由下的情况
  routes: [
    {
      path: '/app2/user',
      component: './user',
    },
    {
      path: '/app2',
      component: './index',
    },
  ],
};
