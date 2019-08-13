const { Helmet } = require('react-helmet');

export default {
  ssr: {
    // for other test, you could not use
    disableExternal: true,
    disableExternalWhiteList: ['react-helmet', 'react-document-title'],
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
        const helmet = Helmet.renderStatic();
        const title = helmet.title.toString();
        const meta = helmet.meta.toString();
        const link = helmet.link.toString();

        if (title !== '<title data-react-helmet="true"></title>') {
          $('html head').prepend(title);
        }
        $('html head').append(meta)
        $('html head').append(link)

        return $;
      }
    }]
  ]
}
