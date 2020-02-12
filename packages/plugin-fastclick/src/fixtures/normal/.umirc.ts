
export default {
  history: {
    type: 'memory',
    options: {
      initialEntries: ['/'],
    },
  },
  fastclick: {
    touchBoundary: 300,
    tapDelay: 300,
  },
  mountElementId: '',
  routes: [
    { path: '/', component: 'index' },
  ],
}
