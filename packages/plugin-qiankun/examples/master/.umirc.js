export default {
  proxy: {
    '/api/app1': {
      target: 'http://localhost:8001',
      changeOrigin: true,
    },
    '/api/app2': {
      target: 'http://localhost:8002',
      changeOrigin: true,
    },
    '/api/app3': {
      target: 'http://localhost:8003',
      changeOrigin: true,
    },
  },
  qiankun: {
    master: {
      defer: true,
      jsSandbox: true,
      prefetch: true,
    },
  },
  plugins: [
    require.resolve('../../../plugin-dva/lib'),
    require.resolve('../../../plugin-antd/lib'),
    require.resolve('../../../plugin-qiankun/lib'),
    // [
    //   '../../index',
    //   {
    //     master: {
    //       defer: true,
    //       jsSandbox: true,
    //       prefetch: true,
    //     },
    //   },
    // ],
    // [
    //   'umi-plugin-react',
    //   {
    //     title: 'qiankun-demo',
    //     antd: true,
    //     dva: {
    //       immer: true,
    //       hmr: true,
    //     },
    //     dynamicImport: true,
    //     routes: {
    //       exclude: [
    //         /models\//,
    //         /services\//,
    //         /model\.(t|j)sx?$/,
    //         /service\.(t|j)sx?$/,
    //       ],
    //     },
    //   },
    // ],
  ],
};
