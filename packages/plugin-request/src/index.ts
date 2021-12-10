import { IApi } from 'umi';
import { join, dirname } from 'path';
import { existsSync, mkdirSync, readFileSync } from 'fs';

export interface RequestOptions {
  dataField?: string;
}

export default function (api: IApi) {
  const {
    paths,
    utils: { winPath },
  } = api;

  api.addRuntimePluginKey(() => 'request');

  const umiRequestPkgPath = winPath(
    dirname(require.resolve('umi-request/package')),
  );
  const useRequestPkgPath = winPath(
    dirname(require.resolve('@ahooksjs/use-request/package')),
  );

  api.addDepInfo(() => {
    const pkg = require('../package.json');
    return [
      {
        name: 'umi-request',
        range: pkg.dependencies['umi-request'],
        alias: [umiRequestPkgPath],
      },
      {
        name: '@ahooksjs/use-request',
        range: pkg.dependencies['@ahooksjs/use-request'],
        alias: [useRequestPkgPath],
      },
    ];
  });

  // 配置
  api.describe({
    config: {
      schema(joi) {
        return joi.object({
          dataField: joi
            .string()
            .pattern(/^[a-zA-Z]*$/)
            .allow(''),
        });
      },
      default: {
        dataField: 'data',
      },
    },
  });

  const requestTemplate = readFileSync(
    winPath(join(__dirname, '../src/request.ts')),
    'utf-8',
  );
  const uiIndexTemplate = readFileSync(
    winPath(join(__dirname, '../src/ui/index.ts')),
    'utf-8',
  );
  const uiNoopTemplate = readFileSync(
    winPath(join(__dirname, '../src/ui/noop.ts')),
    'utf-8',
  );
  const namespace = 'plugin-request';

  api.chainWebpack((webpackConfig) => {
    // decoupling antd ui library
    webpackConfig.resolve.alias.set(
      '@umijs/plugin-request/lib/ui',
      api.config.antd === false
        ? winPath(join(api.paths.absTmpPath!, namespace, './ui/noop'))
        : winPath(join(api.paths.absTmpPath!, namespace, './ui/index')),
    );

    return webpackConfig;
  });

  api.onGenerateFiles(() => {
    const { dataField = 'data' } = api.config.request as RequestOptions;
    try {
      // Write .umi/plugin-request/request.ts
      let formatResultStr;
      if (dataField === '') {
        formatResultStr = 'formatResult: result => result';
      } else {
        formatResultStr = `formatResult: result => result?.${dataField}`;
      }
      api.writeTmpFile({
        path: winPath(join(namespace, 'request.ts')),
        content: requestTemplate
          .replace(/\/\*FRS\*\/(.+)\/\*FRE\*\//, formatResultStr)
          .replace(/\['data'\]/g, dataField ? `['${dataField}']` : '')
          .replace(/data\?: T;/, dataField ? `${dataField}?: T;` : '')
          .replace(/umi-request/g, umiRequestPkgPath)
          .replace(/@ahooksjs\/use-request/g, useRequestPkgPath)
          .replace(
            `import { ApplyPluginsType, history, plugin } from 'umi';`,
            `
import { ApplyPluginsType } from 'umi';
import { history, plugin } from '../core/umiExports';
            `,
          ),
      });
      const uiTmpDir = join(api.paths.absTmpPath!, namespace, 'ui');
      !existsSync(uiTmpDir) && mkdirSync(uiTmpDir, { recursive: true });
      api.writeTmpFile({
        path: winPath(join(namespace, 'ui/index.ts')),
        content: uiIndexTemplate,
      });
      api.writeTmpFile({
        path: winPath(join(namespace, 'ui/noop.ts')),
        content: uiNoopTemplate,
      });
    } catch (e) {
      api.logger.error(e);
    }
  });

  api.addUmiExports(() => {
    return [
      {
        exportAll: true,
        source: `../${namespace}/request`,
      },
    ];
  });
}
