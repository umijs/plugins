
export default {
  routes: [
    { path: '/', component: 'index', access: 'canReadFoo' },
  ],
  plugins: [
    require.resolve('../../'),
    require.resolve('@umijs/plugin-initial-state'),
    require.resolve('@umijs/plugin-model'),
  ]
}
