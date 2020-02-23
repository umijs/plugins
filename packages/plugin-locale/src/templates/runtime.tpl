import React from 'react';
// @ts-ignore
import { _LocaleContainer } from './locale';

export function rootContainer(container: Element) {
  return React.createElement(_LocaleContainer, null, container);
}
