import { defineConfig } from 'umi';

export default defineConfig({
  history: 'memory',
  mountElementId: '',
  routes: [{ path: '/', component: './index' }],
  svgIcon: {},
  plugins: [
    require.resolve('../../'),
  ]
});
