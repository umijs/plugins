import { IApi } from 'umi';

export { isMasterEnable } from './master';
export { isSlaveEnable } from './slave';

export * from './types';

export default function (api: IApi) {
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

  api.registerPlugins([
    require.resolve('./master'),
    require.resolve('./slave'),
  ]);
}
