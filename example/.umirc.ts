import { defineConfig } from 'umi';

export default defineConfig({
  plugins: [
    require.resolve('../packages/plugin-antd/lib'),
    require.resolve('../packages/plugin-dva/lib'),
  ],
});
