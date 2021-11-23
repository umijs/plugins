import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import { IApi, utils } from 'umi';
import { ConfigProviderProps } from 'antd/es/config-provider';
import semver from 'semver';

const { Mustache } = utils;

interface IAntdOpts {
  dark?: boolean;
  compact?: boolean;
  mobile?: boolean;
  disableBabelPluginImport?: boolean;
  config?: ConfigProviderProps;
}

export default (api: IApi) => {
  const opts: IAntdOpts = api.userConfig.antd;
  const mobile = opts?.mobile !== false;
  const useBabelPluginImport = opts?.disableBabelPluginImport !== true;
  api.describe({
    config: {
      schema(joi) {
        return joi.object({
          dark: joi.boolean(),
          compact: joi.boolean(),
          mobile: joi.boolean(),
          disableBabelPluginImport: joi.boolean(),
          config: joi.object(),
        });
      },
    },
  });
  api.modifyBabelPresetOpts((opts) => {
    const imps = [];
    if (useBabelPluginImport) {
      imps.push({
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      })
    }
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
        'root-entry-name': 'default',
        ...getThemeVariables(opts),
        ...config.theme,
      };
      return config;
    });
  }

  api.modifyDefaultConfig((config) => {
    config.theme = {
      'root-entry-name': 'default',
      ...config.theme,
    };
    return config;
  });

  api.addProjectFirstLibraries(() => {
    const imps = [];
    if (useBabelPluginImport) {
      imps.push({
        name: 'antd',
        path: dirname(require.resolve('antd/package.json')),
      })
    }
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

        // 获取 antd 的版本号来判断应该是用什么api
        let version = '4.0.0';
        try {
          version = require(require.resolve('antd/package.json')).version;
        } catch (error) {}

        api.writeTmpFile({
          path: 'plugin-antd/runtime.tsx',
          content: Mustache.render(runtimeTpl, {
            config: JSON.stringify(opts?.config),
            // @ts-ignore
            newAntd: semver.lt('4.13.0', version) || version === '4.13.0',
            oldAntd: semver.gt('4.13.0', version),
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
