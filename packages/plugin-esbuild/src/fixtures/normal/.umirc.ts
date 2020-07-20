
export default {
  nodeModulesTransform: {
    type: 'none',
  },
  history: {
    type: 'memory',
    options: {
      initialEntries: ['/'],
    },
  },
  plugins: [
    require.resolve('../../index.ts')
  ],
  mountElementId: '',
  routes: [
    { path: '/', component: 'index' },
  ],
  esbuild: {},
}
