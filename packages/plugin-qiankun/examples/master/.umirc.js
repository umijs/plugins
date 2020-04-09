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
      apps: [
        {
          name: 'app1',
          entry: 'http://localhost:8001/app1',
        },
        {
          name: 'app2',
          entry: 'http://localhost:8002/app2',
          props: {
            testProp: 'test',
          },
        },
        {
          name: 'app3',
          entry: 'http://localhost:8003/app3',
        },
      ],
      defer: true,
      jsSandbox: true,
      prefetch: true,
    },
  },
  routes: [
    {
      path: '/',
      component: '../layouts/index.js',
      routes: [
        {
          path: '/app1',
          microApp: 'app1',
          settings: { singular: false },
        },
        {
          path: '/app2',
          component: './app2/index.js',
        },
        {
          path: '/',
          component: './index.js',
        },
      ],
    },
  ],
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
