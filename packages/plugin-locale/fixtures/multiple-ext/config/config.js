export default {
  plugins: [
    require.resolve('../../../src/index'),
  ],
  locale: {
    enable: true,
    baseNavigator: false,
    default: 'en-US',
  },
  singular: true,
};
