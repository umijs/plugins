import { name } from './package.json';

const appName = `${name.slice(name.indexOf('/') + 1)}`;

export default {
  base: appName,
  publicPath: '/app2/',
  outputPath: './dist/app2',
  mountElementId: 'app2',
  qiankun: {
    // 修改umd library name 示例
    slave: { libraryName: appName },
  },
  plugins: [
    require.resolve('../../../plugin-dva/lib'),
    require.resolve('../../../plugin-model/lib'),
    require.resolve('../../../plugin-antd/lib'),
    require.resolve('../../../plugin-qiankun/lib'),
  ],
};
