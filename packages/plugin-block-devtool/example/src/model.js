import request from 'umi-request';

export default {
  namespace: 'test',
  state: {
    text: 'loading...',
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(request, '/api/test');
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type:'fetch' });
    },
  },
};
