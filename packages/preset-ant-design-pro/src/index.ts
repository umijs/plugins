import { IApi } from 'umi';

export default (api: IApi) => {
  const plugins = [
    require.resolve('@umijs/plugin-block-devtool'),
    require.resolve('umi-plugin-pro-block'),
  ];

  // 有 plugin-react 时不加 plugin-antd-icon-config，因为已经内置了
  // 在 ant-design-pro 5 之后，用 plugin-react，去 plugin-antd-icon-config
  if (!api.hasPlugins(['@umijs/plugin-react'])) {
    plugins.push(require.resolve('umi-plugin-antd-icon-config'));
  }
  return {
    plugins,
  };
};
