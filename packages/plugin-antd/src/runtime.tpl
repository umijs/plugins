import React from 'react';
import { ConfigProvider } from 'antd';
import { ApplyPluginsType } from 'umi';
import { plugin } from '../core/umiExports';

export function rootContainer(container) {
  const { locale, ...runtimeAntd } = plugin.applyPlugins({
    key: 'antd',
    type: ApplyPluginsType.modify,
    initialValue: {},
  });
  if (locale) {
    console.warn(
      'Invalid locale configuration in runtime.antd.config, please use plug-in @umijs/plugin-locale',
    );
  }
  return React.createElement(ConfigProvider, {...{{{ config }}},...runtimeAntd}, container);
}
