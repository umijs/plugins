import React from 'react';
// @ts-ignore
import { _DvaContainer } from '@@/plugin-dva/dva';

export function rootContainer(container) {
  return React.createElement(_DvaContainer, null, container);
}
