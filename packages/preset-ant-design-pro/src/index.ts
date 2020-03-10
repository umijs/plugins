import { IApi } from 'umi';

export default (api: IApi) => {
  const getPlugin = (pkg: string): string[] => {
    if (!api.hasPlugins([pkg])) {
      return [pkg];
    }
    return [];
  };
  return {
    plugins: [
      ...getPlugin('umi-plugin-antd-icon-config'),
      ...getPlugin('umi-plugin-antd-theme'),
      ...getPlugin('@umijs/plugin-block-devtool'),
    ],
  };
};
