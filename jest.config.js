module.exports = {
  transformIgnorePatterns: [
    'node_modules/(?!.*(@(babel)|dva-loading))[^/]+?/(?!(es|node_modules)/)',
  ],
  moduleNameMapper(memo) {
    return Object.assign(memo, {
      '^react$': require.resolve('react'),
      '^react-dom$': require.resolve('react-dom'),
    });
  },
};
