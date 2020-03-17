/* eslint-disable import/no-dynamic-require */
import React from 'react';
import { DIR_NAME_IN_TMP } from './constants';
import Provider from './Provider';

export function rootContainer(container: React.ReactNode) {
  return React.createElement(
    Provider,
    null,
    container,
  );
}
