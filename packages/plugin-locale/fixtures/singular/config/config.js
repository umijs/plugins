export default {
  plugins: [
    [
      '../../../lib/index.js',
      {
        useLocalStorage: false,
        baseNavigator: false,
        default: 'en-US',
      },
    ],
  ],
  singular: true,
};
