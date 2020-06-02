import React from 'react';
import { ConfigProvider } from 'antd';

export function rootContainer(container) {
  return React.createElement(ConfigProvider, {{{ config }}}, container);
}
