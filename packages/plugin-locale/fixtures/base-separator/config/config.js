export default {
  locale: {
    baseNavigator: false,
    antd: true,
    baseSeparator: '_',
    default: 'zh_CN',
  },
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
};
