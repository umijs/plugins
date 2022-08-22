import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import { IApi, utils } from 'umi';
import { ConfigProviderProps } from 'antd/es/config-provider';
import semver from 'semver';

const { Mustache } = utils;

interface IAntdOpts {
  dark?: boolean;
  compact?: boolean;
  disableBabelPluginImport?: boolean;
  config?: ConfigProviderProps;
}

export default (api: IApi) => {
  const opts: IAntdOpts = api.userConfig.antd;
  const useBabelPluginImport = opts?.disableBabelPluginImport !== true;

  let pkgPath: string;
  let antdVersion = '4.0.0';
  let proComponentsVersion = '2.0.0';
  try {
    pkgPath = dirname(require.resolve('antd/package.json'));
    antdVersion = require(`${pkgPath}/package.json`).version;

    const techUiPkgPath = dirname(
      require.resolve('@ant-design/pro-components/package.json'),
    );
    proComponentsVersion = require(`${techUiPkgPath}/package.json`).version;
  } catch (e) {}

  api.describe({
    config: {
      schema(joi) {
        return joi.object({
          dark: joi.boolean(),
          compact: joi.boolean(),
          disableBabelPluginImport: joi.boolean(),
          config: joi.object(),
        });
      },
    },
  });
  api.modifyBabelPresetOpts((opts) => {
    if (antdVersion.startsWith('5')) return opts;
    const imps = [];
    if (useBabelPluginImport) {
      imps.push({
        libraryName: 'antd',
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
    if (antdVersion.startsWith('5')) return [];
    if (useBabelPluginImport) {
      imps.push({
        name: 'antd',
        path: dirname(require.resolve('antd/package.json')),
      });
    }
    return imps;
  });

  api.addEntryImportsAhead(() => {
    // 旧版本的 antd 和 tech-ui 同时使用时，因为 babel-import 没有打开，所以样式会不加载
    const isNewTechUI =
      antdVersion.startsWith('4') && proComponentsVersion.startsWith('2');

    if (isNewTechUI) {
      return [
        {
          source: 'antd/dist/antd.less',
        },
      ];
    }
    return [];
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
    api.addRuntimePlugin(() => {
      if (antdVersion.startsWith('5')) return [];
      return [join(api.paths.absTmpPath!, 'plugin-antd/runtime.tsx')];
    });
    api.addRuntimePluginKey(() => ['antd']);
  }
};
