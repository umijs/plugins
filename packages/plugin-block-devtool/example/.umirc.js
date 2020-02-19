export default {
  plugins: [require.resolve('../lib')],
  blockDevtool: {
    layout: 'ant-design-pro',
    menu: {
      name: 'demo',
    },
    mockUmiRequest: true, // whether to build mock data . _mock.js \ _mock.ts
  },
};
