
export default {
  nodeModulesTransform: {
    type: 'none',
  },
  ssr: {},
  history: {
    type: 'memory',
    options: {
      initialEntries: ['/'],
    },
  },
  mountElementId: '',
  routes: [
    { path: '/', component: 'index' },
  ],
  esbuild: {},
}
