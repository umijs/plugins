import { query } from '@/services/user';

// TODO 移动到 user/model.js 测试动态加载 dva model 的场景

export default {
  namespace: 'user',

  state: {
    list: [],
  },

  effects: {
    *query(_, { put }) {
      const { data } = yield query();
      yield put({
        type: 'querySuccess',
        payload: {
          list: data,
        },
      });
    },
  },

  reducers: {
    querySuccess(state, { payload }) {
      state.list = payload.list;
    },
  },
};
