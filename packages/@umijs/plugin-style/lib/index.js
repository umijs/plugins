"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(api, option) {
  const isUrl = url => /^(http:|https:)?\/\//.test(url);

  api.onOptionChange(newOption => {
    option = newOption;
    api.rebuildHTML();
    api.refreshBrowser();
  });
  api.addHTMLStyle(() => {
    return option.filter(opt => !isUrl(opt)).map(aStyle => ({
      content: aStyle
    }));
  });
  api.addHTMLLink(() => {
    return option.filter(opt => isUrl(opt)).map(aLink => ({
      rel: 'stylesheet',
      href: aLink
    }));
  });
}