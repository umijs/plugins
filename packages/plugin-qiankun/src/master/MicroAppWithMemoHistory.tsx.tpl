import React from 'react';
import { MicroApp, Props as MicroAppProps } from './MicroApp';

export interface Props extends MicroAppProps {
  history?: never
}

export function MicroAppWithMemoHistory(componentProps: Props) {
  const { url, ...rest } = componentProps;

  return (
    <MicroApp
      {...rest}
      history={{
        type: 'memory',
        initialEntries: [url],
        initialIndex: 1,
      }}
    />
  )
}
