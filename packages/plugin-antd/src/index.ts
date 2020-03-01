import { dirname, join } from 'path';
import { IApi } from 'umi';

interface IAntdOpts {
  dark?: boolean;
}

export default (api: IApi) => {
  const { semver } = api.utils;
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
    const antdPkgPath = require.resolve('antd/package', { paths: [api.cwd] });
    const { version } = require(antdPkgPath) || {};
    if (semver.major(version) === 4) {
      // support dark mode, user use antd 4 by default
      const darkThemeVars = require(require.resolve('antd/dist/dark-theme', {
        paths: [api.cwd],
      }));
      api.modifyDefaultConfig(config => {
        config.theme = {
          hack_less_umi_plugin: `true;@import "${require.resolve(
            'antd/lib/style/color/colorPalette.less',
            { paths: [api.cwd] },
          )}";`,
          ...darkThemeVars,
          ...config.theme,
        };
        return config;
      });
    } else {
      api.logger.warn('the `antd.dark` option only supports antd^4.0');
    }
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
