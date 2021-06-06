import { query } from '@/services/app';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default {
  namespace: 'base',

  state: {
    name: 'Qiankun',
    apps: [],
  },

  effects: {
    *getApps(_, { put }) {
      /*
       子应用配置信息获取分同步、异步两种方式
       同步有两种配置方式，1、app.js导出qiankun对象，2、配置写在umi配置文件中，可通过import @tmp/subAppsConfig获取
      */
      yield sleep(1000);

      const apps = yield query();
      yield put({
        type: 'getAppsSuccess',
        payload: {
          apps,
        },
      });
    },
  },

  reducers: {
    getAppsSuccess(state, { payload }) {
      return {
        ...state,
        apps: payload.apps,
      };
    },
  },
};
