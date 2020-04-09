export default {
  plugins: [require.resolve('../lib')],
  blockDevtool: {
    menu: {
      name: 'demo',
    },
    mockUmiRequest: true, // whether to build mock data . _mock.js \ _mock.ts
  },
};
