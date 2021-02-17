
export default {
  history: {
    type: 'memory',
    options: {
      initialEntries: ['/'],
    },
  },
  sourceMap: false,
  mountElementId: '',
  routes: [
    { path: '/', component: 'index' },
  ],
}
