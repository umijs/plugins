import React from 'react';
import { HelmetProvider } from '{{{ HelmetPkg }}}';

// helmetContext for ssr
const helmetContext = {};

{{#SSR}}
const { modifyHTMLHOC } = require('{{{ Utils }}}');
export const ssr = {
  modifyHTML: modifyHTMLHOC({
    helmetContext,
  }),
};
{{/SSR}}

export function rootContainer(container) {
  return React.createElement(HelmetProvider, { context: helmetContext }, container);
};
