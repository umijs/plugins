import { IApi, IConfig } from '@umijs/types';

export default (api: IApi) => {
  const defaultOptions = {
    access: {},
  } as IConfig;

  api.modifyDefaultConfig((memo) => {
    return {
      ...defaultOptions,
      ...memo,
    };
  });
};
