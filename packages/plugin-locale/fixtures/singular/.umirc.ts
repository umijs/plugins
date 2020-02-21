
export default {
  history: {
    type: 'memory',
    options: {
      initialEntries: ['/'],
    },
  },
  singular: true,
  locale: {
    default: 'zh-CN',
  },
  mountElementId: '',
  routes: [
    { path: '/', component: 'index' },
  ],
}
