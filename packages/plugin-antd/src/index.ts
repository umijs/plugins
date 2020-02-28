import { dirname } from 'path';
import { IApi } from 'umi';

interface IAntdOpts {
  dark?: boolean;
}

export default (api: IApi) => {
  api.describe({
    config: {
      schema(joi) {
        return joi.object({
          dark: joi.boolean(),
        });
      },
    },
  });

  api.modifyBabelPresetOpts(opts => {
    return {
      ...opts,
      import: (opts.import || []).concat([
        { libraryName: 'antd', libraryDirectory: 'es', style: true },
        { libraryName: 'antd-mobile', libraryDirectory: 'es', style: true },
      ]),
    };
  });

  const opts: IAntdOpts = api.userConfig.antd || {};

  if (opts?.dark) {
    // support dark mode, user use antd 4 by default
    const darkThemeVars = require('antd/dist/dark-theme');
    api.modifyDefaultConfig(config => {
      config.theme = {
        hack_less_umi_plugin: `true;@import "${require.resolve(
          'antd/lib/style/color/colorPalette.less',
        )}";`,
        ...darkThemeVars,
        ...config.theme,
      };
      return config;
    });
  }

  api.addProjectFirstLibraries(() => [
    {
      name: 'antd',
      path: dirname(require.resolve('antd/package.json')),
    },
    {
      name: 'antd-mobile',
      path: dirname(require.resolve('antd-mobile/package.json')),
    },
  ]);
};
