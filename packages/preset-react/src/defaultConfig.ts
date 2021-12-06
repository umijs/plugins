import { IApi, IConfig } from '@umijs/types';

export default (api: IApi) => {
  const defaultOptions = {
    access: {},
    ...api.userConfig,
  } as IConfig;

  api.modifyDefaultConfig((memo) => {
    return {
      ...memo,
      ...defaultOptions,
    };
  });
};
