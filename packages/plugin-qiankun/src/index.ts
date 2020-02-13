import { IApi } from 'umi';
import assert from 'assert';
import master from './master';
import slave from './slave';

export default function(api: IApi) {
  api.addRuntimePluginKey(() => 'qiankun');

  api.describe({
    key: 'qiankun',
    config: {
      schema(joi) {
        return joi.object({
          slave: joi.object(),
          master: joi.object(),
        });
      },
    },
  });

  const option = api.service.userConfig.qiankun;
  const { master: masterOpts, slave: slaveOpts } = option || {};
  assert(!(masterOpts && slaveOpts), '请勿同时配置 master 和 slave 配置项');

  if (slaveOpts) {
    slave(api, slaveOpts);
  }
  if (masterOpts) {
    master(api, masterOpts);
  }

  // 监听插件配置变化
  // TODO remove
  // api.onOptionChange((newOpts: GlobalOptions) => {
  //   const { master: masterOpts, slave: slaveOpts } = newOpts || {};
  //   assert(!(masterOpts && slaveOpts), '请勿同时配置 master 和 slave 配置项');
  //   if (masterOpts) {
  //     api.changePluginOption('qiankun-master', {
  //       ...masterOpts,
  //       registerRuntimeKeyInIndex: true,
  //     });
  //   } else {
  //     api.changePluginOption('qiankun-slave', {
  //       ...slaveOpts,
  //       registerRuntimeKeyInIndex: true,
  //     });
  //   }
  // });

  // const { master: masterOpts, slave: slaveOpts } = options || {};

  // assert(!(masterOpts && slaveOpts), '请勿同时配置 master 和 slave 配置项');

  // if (masterOpts) {
  //   api.registerPlugin({
  //     id: 'qiankun-master',
  //     apply: master,
  //     opts: { ...masterOpts, registerRuntimeKeyInIndex: true },
  //   });
  // } else {
  //   api.registerPlugin({
  //     id: 'qiankun-slave',
  //     apply: slave,
  //     opts: { ...slaveOpts, registerRuntimeKeyInIndex: true },
  //   });
  // }
}
