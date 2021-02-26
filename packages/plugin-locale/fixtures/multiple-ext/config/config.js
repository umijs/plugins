export default {
  plugins: [
    require.resolve('../../../src/index'),
  ],
  locale: {
    baseNavigator: false,
    useLocalStorage: false,
    default: 'en-US',
  },
  singular: true,
};
