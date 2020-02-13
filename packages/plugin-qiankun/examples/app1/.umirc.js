export default {
  // TODO 等 umi3 支持相关配置
  // base: '/app1',
  publicPath: '/app1/',
  // outputPath: './dist/app1',
  mountElementId: 'app1',
  routes: [
    {
      path: '/app1/user',
      component: './user',
    },
    {
      path: '/app1',
      component: './index',
    },
  ],
  qiankun: {
    slave: {},
  },
  plugins: [
    require.resolve('../../../plugin-dva/lib'),
    require.resolve('../../../plugin-antd/lib'),
    require.resolve('../../../plugin-qiankun/lib'),
  ],
};
