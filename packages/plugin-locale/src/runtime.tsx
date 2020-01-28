import React from 'react';
// @ts-ignore
import { _LocaleContainer } from '@@/plugin-locale/locale';

export function rootContainer(container: Element) {
  return React.createElement(_LocaleContainer, null, container);
}
