import { IApi } from 'umi';

export default (api: IApi) => {
  const getPlugin = (
    pkg: string,
    type: 'preset' | 'plugin' = 'plugin',
  ): string[] => {
    const existPlugin = type === 'preset' ? api.hasPresets : api.hasPlugins;
    if (!existPlugin([pkg])) {
      return [pkg];
    }
    return [];
  };
  return {
    presets: [...getPlugin('@umijs/preset-react')],
    plugins: [
      ...getPlugin('umi-plugin-antd-icon-config'),
      ...getPlugin('umi-plugin-antd-theme'),
      ...getPlugin('umi-plugin-pro-block'),
    ],
  };
};
