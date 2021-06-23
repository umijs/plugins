import { name } from './package.json';

const libraryName = `${name.charAt(0).toUpperCase() + name.slice(1)}`;

export default {
  base: name,
  publicPath: '/app2/',
  outputPath: './dist/app2',
  mountElementId: 'app2',
  qiankun: {
    // 修改umd library name 示例
    slave: { libraryName },
  },
  plugins: [
    require.resolve('../../../plugin-dva/lib'),
    require.resolve('../../../plugin-model/lib'),
    require.resolve('../../../plugin-antd/lib'),
    require.resolve('../../../plugin-qiankun/lib'),
  ],
};
