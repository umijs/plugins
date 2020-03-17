import { IApi } from 'umi';

export default (api: IApi) => {
  api.modifyConfig(memo => {
    memo.history = {
      type: 'memory',
      options: {
        initialEntries: ['/'],
      },
    };
    memo.mountElementId = '';
    return memo;
  });
};
