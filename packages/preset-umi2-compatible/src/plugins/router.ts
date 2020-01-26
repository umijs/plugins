import { IApi } from 'umi';

export default (api: IApi) => {
  api.addUmiExports(() => {
    return [
      {
        source: require.resolve('../../src/plugins/historyAdapater.ts'),
        exportAll: true,
      },
    ];
  });
};
