import React from 'react';
import { ConfigProvider } from 'antd';
import { ApplyPluginsType } from 'umi';
import { plugin } from '../core/umiExports';

export function rootContainer(container) {
  const runtimeAntd = plugin.applyPlugins({
    key: 'antd',
    type: ApplyPluginsType.modify,
    initialValue: {},
  });

  return React.createElement(ConfigProvider, {...{{{ config }}},...runtimeAntd}, container);
}
