export default {
  plugins: [
    require.resolve('../../../src/index'),
  ],
  locale: {
    enable: true,
    baseNavigator: false,
    baseSeparator: '_',
    default: 'en_US',
  },
  singular: false,
};
