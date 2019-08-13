
export default {
  ssr: true,
  externals: {
    'react-helmet': 'react-helmet',
  },
  plugins: [
    ['../../../lib/index.js', {
      runInMockContext: {
        context: {
          siteName: 'Umi SSR react-helment'
        }
      },
      postProcessHtml: ($, path) => {
        const { Helmet } = require('react-helmet');
        Helmet.canUseDOM = false;
        console.log('HelmetHelmet', Helmet.contextType)
        console.log('peekpeekpeek', Helmet.peek());
        const helmet = Helmet.renderStatic();
        console.log('aaaa', helmet.title.toString());
        console.log('title origin', $('title').text());

        console.log('hhhh', helmet.title.toString(), path);
        // $('title').html(title.toString());
        return $;
      }
    }]
  ]
}
