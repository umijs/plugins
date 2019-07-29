export default {
  ssr: true,
  plugins: [
    ['../../../lib/index.js', {
      staticMarkup: true,
      runInMockContext: {
        context: {
          siteName: 'Umi SSR'
        }
      }
    }]
  ]
}
