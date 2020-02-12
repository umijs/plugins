import { LayoutConfig } from '../types/interface.d';

export default (
  userConfig: LayoutConfig,
  path: string,
) => `import React from 'react';
import { ApplyPluginsType } from 'umi';
import { plugin } from '../core/umiExports';

export default (props) => {
  const runtimeConfig = plugin.applyPlugins({
    key: 'layout',
    type: ApplyPluginsType.modify,
    initialValue: {},
  }) || {};
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
