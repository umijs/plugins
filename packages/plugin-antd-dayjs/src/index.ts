import { readFileSync } from 'fs';
import { IApi, utils } from 'umi';
import { join, dirname } from 'path';
const { Mustache } = utils;

const presets = {
  antd: {
    plugins: [
      'isSameOrBefore',
      'isSameOrAfter',
      'advancedFormat',
      'customParseFormat',
      'weekday',
      'weekYear',
      'weekOfYear',
      'isMoment',
      'localeData',
      'localizedFormat',
    ],
    replaceMoment: true,
  },
  antdv3: {
    plugins: [
      'isSameOrBefore',
      'isSameOrAfter',
      'advancedFormat',
      'customParseFormat',
      'weekday',
      'weekYear',
      'weekOfYear',
      'isMoment',
      'localeData',
      'localizedFormat',
      'badMutable',
    ],
    replaceMoment: true,
  },
};

const getConfig = (api: IApi) => {
  let {
    preset = 'antd',
    plugins,
    replaceMoment,
  } = api.userConfig.antdDayjs || {};

  if (preset && presets[preset]) {
    plugins = presets[preset].plugins;
    replaceMoment = presets[preset].replaceMoment;
  }
  if (plugins) plugins = plugins;
  if (replaceMoment !== undefined) replaceMoment = replaceMoment;
  return {
    plugins,
    replaceMoment,
  };
};

export default (api: IApi) => {
  api.describe({
    key: 'antdDayjs',
    config: {
      schema(joi) {
        return joi.object({
          preset: joi.string(), // 'antd' | 'antdv3'
          plugins: joi.array(),
          replaceMoment: joi.boolean(),
        });
      },
    },
    enableBy: api.EnableBy.config,
  });

  api.chainWebpack({
    fn: (memo) => {
      const { replaceMoment } = getConfig(api);
      if (replaceMoment) {
        memo.resolve.alias.set(
          'moment',
          dirname(require.resolve('dayjs/package.json')),
        );
      }
      return memo;
    },
  });

  api.onGenerateFiles({
    fn: () => {
      const { plugins } = getConfig(api);

      const runtimeTpl = readFileSync(
        join(__dirname, './runtime.tpl'),
        'utf-8',
      );
      api.writeTmpFile({
        path: 'plugin-antd-dayjs/runtime.tsx',
        content: Mustache.render(runtimeTpl, {
          plugins,
          dayjsPath: dirname(require.resolve('dayjs/package.json')),
        }),
      });
    },
  });
  api.addEntryCodeAhead(() => {
    return `import './plugin-antd-dayjs/runtime.tsx'`;
  });
};
