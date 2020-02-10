import { IApi } from 'umi';
import { join, dirname } from 'path';
import assert from 'assert';
import { readFileSync } from 'fs';

export interface RequestOptions {
  dataField?: string;
}

export default function(api: IApi, options: RequestOptions) {
  const {
    paths,
    utils: { winPath },
  } = api;

  api.addRuntimePluginKey(() => 'request');

  const { dataField = 'data' } = options || {};
  const source = join(__dirname, '..', 'src', 'request.ts');
  const requestTemplate = readFileSync(source, 'utf-8');
  const namespace = 'plugin-request';
  assert(/^[a-zA-Z]*$/.test(dataField), 'dataField should match /^[a-zA-Z]*$/');

  api.onGenerateFiles(() => {
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
          .replace(/data: T;/, dataField ? `${dataField}: T;` : '')
          .replace(
            /umi-request/g,
            winPath(dirname(require.resolve('umi-request/package'))),
          )
          .replace(
            /@umijs\/use-request/g,
            winPath(dirname(require.resolve('@umijs/use-request/package'))),
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
        source: winPath(join(paths.absTmpPath!, namespace, 'request')),
      },
    ];
  });
}
