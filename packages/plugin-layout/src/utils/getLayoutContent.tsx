import { LayoutConfig } from '../types/interface.d';

export default (
  userConfig: LayoutConfig,
  path: string,
) => `import React from 'react';

export default (props) => {
  const runtimeConfig = require('umi/_runtimePlugin').mergeConfig('layout') || {};
  const userConfig = {
    ...${JSON.stringify(userConfig).replace(/"/g, "'")},
    ...runtimeConfig
  };
  return React.createElement(require('${path}').default, {
    userConfig,
    ...props
  })
}
`;
