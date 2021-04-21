
export default {
  nodeModulesTransform: {
    type: 'none',
  },
  targets: {
    ie: false,
    edge:15,
    chrome:51
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
  esbuild: {},
}
