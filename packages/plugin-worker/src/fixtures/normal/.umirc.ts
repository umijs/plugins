
export default {
  history: {
    type: 'memory',
    options: {
      initialEntries: ['/'],
    },
  },
  mountElementId: '',
  webWorker: {},
  routes: [
    { path: '/', component: 'index' },
  ],
}
