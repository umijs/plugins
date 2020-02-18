import { join } from 'path';

export default {
  plugins: [
    [
      join(__dirname, '..', require('../package').main || 'index.js'),
      {
        layout: 'ant-design-pro',
        menu: {
          name: 'demo',
          icon: 'home',
        },
        mockUmiRequest: true // whether to build mock data . _mock.js \ _mock.ts
      }
    ],
    [
      'umi-plugin-react',
      {
        dva: true,
        locale: true,
        antd: true
      }
    ]
  ]
};
