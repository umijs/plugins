export default {
  plugins: [
    '@umijs/plugin-blocks',
    require.resolve('../../plugin-pro-block/lib'),
  ],
  proBlock: {
    modifyRequest: true,
    moveService: true,
    moveMock: true,
    moveService: true,
    autoAddMenu: true,
  },
};
