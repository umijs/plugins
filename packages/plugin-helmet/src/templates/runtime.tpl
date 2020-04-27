import React from 'react';
import { HelmetProvider, Helmet } from '{{{ HelmetPkg }}}';

const helmetContext = {};

{{#SSR}}
export const ssr = {
  modifyHTML: (html) => {
    const { Stream } = require('stream');
    const { cheerio } = require('{{{ Utils }}}');
    const helmet = helmetContext.helmet || Helmet.renderStatic();
    const title = helmet.title.toString();
    const htmlAttributes = helmet.htmlAttributes.toString();
    const meta = helmet.meta.toString();
    const link = helmet.link.toString();
    console.log('helmet.htmlAttributes', helmet.htmlAttributes);
    if (html instanceof Stream) {
      // TODO
      return html;
    }
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
    if (htmlAttributes && htmlAttributes.split(' ')?.length > 0) {
      htmlAttributes.split(' ').forEach(attr => {
        const [attrName, attrVal] = attr.split('=');
        console.log('qwef', attr.split('='));
        $('html').attr(attrName, attrVal);
      })
    }
    return $.html();
  }
};
{{/SSR}}

export function rootContainer(container) {
  return React.createElement(HelmetProvider, { context: helmetContext }, container);
}
