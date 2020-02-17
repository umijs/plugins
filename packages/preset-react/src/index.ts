export default () => {
  return {
    plugins: [
      require.resolve('@umijs/plugin-antd'),
      require.resolve('@umijs/plugin-dva'),
      require.resolve('@umijs/plugin-locale'),
      require.resolve('@umijs/plugin-layout'),
      require.resolve('@umijs/plugin-access'),
      require.resolve('@umijs/plugin-initial-state'),
      require.resolve('@umijs/plugin-model'),
      require.resolve('@umijs/plugin-request'),
      require.resolve('./plugins/crossorigin/crossorigin'),
    ],
  };
};
