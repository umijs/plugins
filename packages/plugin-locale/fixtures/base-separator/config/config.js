export default {
  plugins: [
    require.resolve('../../../src/index'),
  ],
  locale: {
    baseNavigator: false,
    baseSeparator: '_',
    default: 'en_US',
  },
  singular: false,
};
