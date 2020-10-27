export default {
  base: '/app1Name',
  publicPath: '/app1/',
  outputPath: './dist/app1',
  mountElementId: 'app1',
  qiankun: {
    master: {
      apps: [
        {
          name: 'app2',
          entry: 'http://localhost:8002/app2',
        },
      ],
    },
    slave: {},
  },
  plugins: [
    require.resolve('../../../plugin-dva/lib'),
    require.resolve('../../../plugin-model/lib'),
    require.resolve('../../../plugin-antd/lib'),
    require.resolve('../../../plugin-qiankun/lib'),
  ],
};
