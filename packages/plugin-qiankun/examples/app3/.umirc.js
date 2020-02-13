export default {
  // TODO 当前 umi3 还没有支持 base
  // base: '/app3',
  publicPath: '/app3/',
  // outputPath: './dist/app3',
  mountElementId: 'app3',
  qiankun: {
    slave: {},
  },
  plugins: [
    require.resolve('../../../plugin-dva/lib'),
    require.resolve('../../../plugin-antd/lib'),
    require.resolve('../../../plugin-qiankun/lib'),
  ],
  // TODO 测试约定式路由
  routes: [
    { path: '/app3', exact: true, component: './index.js' },
    { path: '/app3/:abc', component: './$abc.js' },
    { path: '/app3/users', component: './user/index.js' },
  ],
  // TODO 测试动态加载的场景
  // dynamicImport: true,
};
