import { IApi } from 'umi';
import proChainWebpack from './chainWebpack';

export default (api: IApi) => {
  const { REACT_APP_ENV } = process.env;
  // support dev tools
  api.modifyDefaultConfig((config) => {
    const { define } = config;

    config.define = {
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: '',
      REACT_APP_ENV: REACT_APP_ENV || false,
      ...(define || {}),
    };
    return config;
  });

  if (api.chainWebpack) {
    api.chainWebpack(proChainWebpack);
  }

  const plugins = [require.resolve('umi-plugin-pro-block')];

  // 有 plugin-react 时不加 plugin-antd-icon-config，因为已经内置了
  // 在 ant-design-pro 5 之后，用 plugin-react，去 plugin-antd-icon-config
  if (!api.hasPlugins(['@umijs/plugin-react'])) {
    plugins.push(require.resolve('umi-plugin-antd-icon-config'));
  }
  return {
    plugins,
  };
};
