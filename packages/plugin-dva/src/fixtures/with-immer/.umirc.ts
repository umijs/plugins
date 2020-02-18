
export default {
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
  dva: {
    immer: true,
  },
}
