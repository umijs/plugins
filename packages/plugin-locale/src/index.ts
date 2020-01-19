import { IApi } from 'umi';

interface IOpts {}

export default (api: IApi, opts: IOpts = {}) => {
  const {
    paths,
    utils: { Mustache, lodash, winPath },
  } = api;
};
