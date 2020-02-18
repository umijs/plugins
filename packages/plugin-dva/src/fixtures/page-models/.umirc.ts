
export default {
  history: {
    type: 'memory',
    options: {
      initialEntries: ['/'],
    },
  },
  mountElementId: '',
  routes: [
    { path: '/', component: 'home/index' },
  ],
}
