import { IApi, utils } from 'umi';
import { join, dirname } from 'path';
import { readFileSync } from 'fs';

const { Mustache } = utils;
export interface RequestOptions {
  dataField?: string;
}

export default function(api: IApi) {
  const {
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

  const namespace = 'plugin-request';

  api.onGenerateFiles(() => {
    const { dataField = 'data' } = api.config.request as RequestOptions;
    const source = join(__dirname, '..', 'src', 'request.ts.tpl');
    console.log('api.config.antd', api.config.antd);
    const requestTemplate = Mustache.render(readFileSync(source, 'utf-8'), {
      // 与 antd 解耦
      Antd: !!api.config.antd,
    });
    try {
      // Write .umi/plugin-request/request.ts
      let formatResultStr;
      if (dataField === '') {
        formatResultStr = 'formatResult: result => result';
      } else {
        formatResultStr = `formatResult: result => result?.${dataField}`;
      }
      api.writeTmpFile({
        path: `${namespace}/request.ts`,
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
