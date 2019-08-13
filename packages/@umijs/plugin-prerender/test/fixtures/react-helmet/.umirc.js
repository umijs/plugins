export default {
  ssr: true,
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
