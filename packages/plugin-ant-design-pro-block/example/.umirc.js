export default {
  plugins: [
    '@umijs/plugin-blocks',
    require.resolve('../../plugin-ant-design-pro-block/lib'),
  ],
  antDesignProBlock: {
    modifyRequest: true,
    moveService: true,
    moveMock: true,
    moveService: true,
    autoAddMenu: true,
  },
};
