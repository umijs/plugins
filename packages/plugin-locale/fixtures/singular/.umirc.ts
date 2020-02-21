
export default {
  history: {
    type: 'memory',
    options: {
      initialEntries: ['/'],
    },
  },
  singular: true,
  locale: {
    baseNavigator: false,
    default: 'zh-CN',
  },
  mountElementId: '',
  routes: [
    { path: '/', component: 'index' },
  ],
}
