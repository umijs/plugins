
export default {
  nodeModulesTransform: {
    type: 'none',
  },
  ssr: {},
  exportStatic: {},
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
