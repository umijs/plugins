
export default {
  routes: [
    { path: '/', component: 'index' },
  ],
  dva: {
    disableModelsReExport: true,
  },
  plugins: [
    require.resolve('../../'),
  ],
}
