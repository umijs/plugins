
export default {
  history: {
    type: 'memory',
    options: {
      initialEntries: ['/'],
    },
  },
  locale: {
    antd: true,
    title: true,
  },
  mountElementId: '',
  routes: [
    { path: '/', component: 'index' },
  ],
}
