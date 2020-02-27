
export default {
  history: {
    type: 'memory',
    options: {
      initialEntries: ['/'],
    },
  },
  singular: true,
  title: 'default.title',
  locale: {
    baseNavigator: false,
    antd: true,
    title: true,
    default: 'zh-CN',
  },
  mountElementId: '',
  routes: [
    { path: '/', component: 'index', title: 'about.title' },
  ],
}
