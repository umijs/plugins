import React from 'react';
// @ts-ignore
import LocaleWrapper from '@@/plugin-locale/LocaleWrapper';

export function rootContainer(container) {
  return React.createElement(LocaleWrapper, null, container);
}
