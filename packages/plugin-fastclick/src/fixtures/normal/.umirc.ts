
export default {
  history: {
    type: 'memory',
    options: {
      initialEntries: ['/'],
    },
  },
  fastClick: {
    touchBoundary: 300,
    tapDelay: 300,
  },
  mountElementId: '',
  routes: [
    { path: '/', component: 'index' },
  ],
}
