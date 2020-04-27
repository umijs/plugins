import { IApi } from 'umi';

export default function (api: IApi) {
  api.addRuntimePluginKey(() => 'qiankun');

  api.describe({
    key: 'qiankun',
    config: {
      schema(joi) {
        return joi
          .object()
          .keys({
            slave: joi.object(),
            master: joi.object(),
          })
          .without('slave', 'master');
      },
    },
    enableBy: api.EnableBy.config,
  });

  api.registerPlugins([
    require.resolve('./master'),
    require.resolve('./slave'),
  ]);
}
