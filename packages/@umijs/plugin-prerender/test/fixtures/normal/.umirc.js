export default {
  ssr: true,
  plugins: [
    ['../../../lib/index.js', {
      runInMockContext: {
        context: {
          siteName: 'Umi SSR'
        }
      }
    }]
  ]
}
