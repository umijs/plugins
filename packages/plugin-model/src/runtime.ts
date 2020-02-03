/* eslint-disable import/no-dynamic-require */
import React from 'react';
import { DIR_NAME_IN_TMP } from './constants';

export function rootContainer(container: React.ReactNode) {
  return React.createElement(
    // eslint-disable-next-line global-require
    require(`@@/${DIR_NAME_IN_TMP}/Provider`).default,
    null,
    container,
  );
}
