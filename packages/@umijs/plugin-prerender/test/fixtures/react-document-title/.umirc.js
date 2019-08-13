const DocumentTitle = require('react-document-title');

export default {
  ssr: {
    nodeExternalsOpts: {
      modulesDir: '../../../node_modules',
    }
  },
  plugins: [
    ['../../../lib/index.js', {
      runInMockContext: {
        context: {
          siteName: 'Umi SSR react-helment'
        }
      },
      postProcessHtml: ($, path) => {
        const title = DocumentTitle.rewind();

        if (title) {
          $('title').html() ? $('title').text(title) : $('html head').prepend(`<title>${title}</title>`)
        }

        return $;
      }
    }]
  ]
}
