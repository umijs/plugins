import { IApi, utils } from 'umi';
import { join } from 'path';

export default function(api: IApi) {
  const { winPath } = utils;
  api.addRuntimePluginKey(() => 'qiankun');

  api.describe({
    key: 'qiankun',
    config: {
      schema(joi) {
        return joi.object().keys({
          slave: joi.object(),
          master: joi.object(),
        });
      },
    },
  });

  api.register({
    key: 'addExtraModels',
    fn: () => [
      {
        absPath: winPath(join(__dirname, './qiankunModel.ts')),
        namespace: '@@qiankun',
      },
    ],
  });

  api.registerPlugins([
    require.resolve('./master'),
    require.resolve('./slave'),
  ]);
}
