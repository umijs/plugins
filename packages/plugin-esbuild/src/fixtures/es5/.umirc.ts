
export default {
  nodeModulesTransform: {
    type: 'none',
  },
  targets: {
    ie: 11,
  },
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
  esbuild: {
    target: 'es5',
  },
}
