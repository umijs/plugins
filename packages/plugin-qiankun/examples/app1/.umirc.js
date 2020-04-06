export default {
  base: '/app1',
  publicPath: '/app1/',
  outputPath: './dist/app1',
  mountElementId: 'app1',
  qiankun: {
    slave: {},
  },
  plugins: [
    require.resolve('../../../plugin-dva/lib'),
    require.resolve('../../../plugin-antd/lib'),
    require.resolve('../../../plugin-qiankun/lib'),
  ],
};
