export default {
  plugins: [
    [
      '../../../lib/index.js',
      {
        baseNavigator: false,
        useLocalStorage: false,
        default: 'en-US',
      },
    ],
  ],
  singular: true,
};
