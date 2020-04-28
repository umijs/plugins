export const modifyHTMLHOC = ({ helmetContext }) => html => {
  const { Stream } = require('stream');
  const cheerio = require('cheerio');
  const helmet = helmetContext.helmet;
  if (!helmet) return html;
  const title = helmet.title.toString();
  const htmlAttributes = helmet.htmlAttributes.toComponent();
  const meta = helmet.meta.toString();
  const link = helmet.link.toString();
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
  if (Object.keys(htmlAttributes)) {
    Object.keys(htmlAttributes).forEach(attrKey => {
      $('html').attr(attrKey, htmlAttributes[attrKey]);
    });
  }
  return $.html();
};
