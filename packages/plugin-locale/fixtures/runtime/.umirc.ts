
export default {
  history: {
    type: 'memory',
    options: {
      initialEntries: ['/'],
    },
  },
  locale: {
    useLocalStorage: false,
    antd: true,
    title: true,
  },
  mountElementId: '',
  routes: [
    { path: '/', component: 'index' },
  ],
}
