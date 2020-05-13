{{#SSR}}
import { Helmet } from '{{{ HelmetPkg }}}';

export const ssr = {
  modifyServerHTML: (html, { cheerio }) => {
    const helmet = Helmet.renderStatic();
    if (!helmet) return html;
    const title = helmet.title.toString();
    const htmlAttributes = helmet.htmlAttributes.toComponent();
    const meta = helmet.meta.toString();
    const link = helmet.link.toString();
    const $ = cheerio.load(html);
    if (title) {
      $('head').prepend(title);
    }
    if (meta) {
      $('head').append(meta);
    }
    if (link) {
      $('link').append(link);
    }
    if (Object.keys(htmlAttributes)) {
      Object.keys(htmlAttributes).forEach(attrKey => {
        $('html').attr(attrKey, htmlAttributes[attrKey]);
      });
    }
    return $.html();
  }
};
{{/SSR}}
