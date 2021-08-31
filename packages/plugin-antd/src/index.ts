import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import { IApi, utils } from 'umi';
import { ConfigProviderProps } from 'antd/es/config-provider';

const { Mustache } = utils;

interface IAntdOpts {
  dark?: boolean;
  compact?: boolean;
  mobile?: boolean;
  config?: ConfigProviderProps;
}

export default (api: IApi) => {
  const opts: IAntdOpts = api.userConfig.antd;
  const mobile = opts?.mobile !== false;
  api.describe({
    config: {
      schema(joi) {
        return joi.object({
          dark: joi.boolean(),
          compact: joi.boolean(),
          mobile: joi.boolean(),
          config: joi.object(),
        });
      },
    },
  });
  api.modifyBabelPresetOpts((opts) => {
    const imps = [{ libraryName: 'antd', libraryDirectory: 'es', style: true }];
    if (mobile) {
      imps.push({
        libraryName: 'antd-mobile',
        libraryDirectory: 'es',
        style: true,
      });
    }
    return {
      ...opts,
      import: (opts.import || []).concat(imps),
    };
  });

  api.addDepInfo(() => {
    function getAntdDependency() {
      const { dependencies, devDependencies } = api.pkg;
      return (
        dependencies?.antd ||
        devDependencies?.antd ||
        require('../package').dependencies.antd
      );
    }

    return {
      name: 'antd',
      range: getAntdDependency(),
    };
  });

  if (opts?.dark || opts?.compact) {
    // support dark mode, user use antd 4 by default
    const { getThemeVariables } = require('antd/dist/theme');
    api.modifyDefaultConfig((config) => {
      config.theme = {
        ...getThemeVariables(opts),
        ...config.theme,
      };
      return config;
    });
  }

  api.addProjectFirstLibraries(() => {
    const imps = [
      {
        name: 'antd',
        path: dirname(require.resolve('antd/package.json')),
      },
    ];
    if (mobile) {
      imps.push({
        name: 'antd-mobile',
        path: dirname(require.resolve('antd-mobile/package.json')),
      });
    }
    return imps;
  });
  if (opts?.config) {
    api.onGenerateFiles({
      fn() {
        // runtime.tsx
        const runtimeTpl = readFileSync(
          join(__dirname, 'runtime.tpl'),
          'utf-8',
        );
        api.writeTmpFile({
          path: 'plugin-antd/runtime.tsx',
          content: Mustache.render(runtimeTpl, {
            config: JSON.stringify(opts?.config),
          }),
        });
      },
    });
    // Runtime Plugin
    api.addRuntimePlugin(() => [
      join(api.paths.absTmpPath!, 'plugin-antd/runtime.tsx'),
    ]);
    api.addRuntimePluginKey(() => ['antd']);
  }
};
