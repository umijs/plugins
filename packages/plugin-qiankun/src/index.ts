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

  const { master: masterOpts, slave: slaveOpts } = api.userConfig.qiankun || {};
  assert(!(masterOpts && slaveOpts), '请勿同时配置 master 和 slave 配置项。');

  if (slaveOpts) {
    slave(api, slaveOpts);
  }
  if (masterOpts) {
    master(api, masterOpts);
  }
}
