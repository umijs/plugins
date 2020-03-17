import { IApi } from 'umi';

export default (api: IApi) => {
  return {
    plugins: [
      // 有 plugin-react 时不加 plugin-antd-icon-config，因为已经内置了
      // 在 ant-design-pro 5 之后，用 plugin-react，去 plugin-antd-icon-config
      !api.hasPlugins(['@umijs/plugin-react']) &&
        require.resolve('umi-plugin-antd-icon-config'),
      require.resolve('@umijs/plugin-block-devtool'),
      require.resolve('umi-plugin-pro-block'),
    ].forEach(Boolean),
  };
};
