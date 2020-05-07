import React from 'react';
import { HelmetProvider } from '{{{ HelmetPkg }}}';

// helmetContext for ssr
const helmetContext = {};

{{#SSR}}
let ssr;
if (process.env.__IS_SERVER) {
  ssr = {
    modifyServerHTML: (html, { cheerio }) => {
      const helmet = helmetContext.helmet;
      if (!helmet) return html;
      const title = helmet.title.toString();
      const htmlAttributes = helmet.htmlAttributes.toComponent();
      const meta = helmet.meta.toString();
      const link = helmet.link.toString();
      const $ = cheerio.load(html);
      // keep latest
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
  }
}
export { ssr };
{{/SSR}}

export function rootContainer(container) {
  return React.createElement(HelmetProvider, { context: helmetContext }, container);
};
