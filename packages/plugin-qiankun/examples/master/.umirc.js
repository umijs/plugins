export default {
  publicPath: 'http://localhost:8000/',
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
      appNameKeyAlias: 'id'
    },
  },
  routes: [
    {
      path: '/',
      component: '../layouts/index.js',
      routes: [
        {
          path: '/app2',
          exact: false,
          component: './app2/index.js',
        },
        {
          path: '/app3',
          microApp: 'app3',
          settings: {
            singular: false,
          },
          microAppProps: {
            autoSetLoading: true,
            className: 'appClassName',
            wrapperClassName: 'wrapperClass',
          },
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
    require.resolve('../../../plugin-model/lib'),
    require.resolve('../../../plugin-antd/lib'),
    require.resolve('../../../plugin-qiankun/lib'),
    // [
    //   '../../index',
    //   {
    //     master: {
    //       defer: true,
    //       sandbox: true,
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
