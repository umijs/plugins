export default {
  publicPath: '/app4/',
  outputPath: './dist/app4',
  mountElementId: 'app4',
  qiankun: {
    slave: {
      masterEntry: 'http://localhost:8000',
    },
  },
  plugins: [
    require.resolve('../../../plugin-model/lib'),
    require.resolve('../../../plugin-antd/lib'),
    require.resolve('../../../plugin-qiankun/lib'),
  ],
  // TODO 测试约定式路由
  routes: [
    { path: '/', exact: true, component: './index.js' },
    { path: '/:abc', component: './$abc.js' },
    { path: '/users', component: './user/index.js' },
  ],
  // TODO 测试 dynamicImport
  // dynamicImport: true,
};
