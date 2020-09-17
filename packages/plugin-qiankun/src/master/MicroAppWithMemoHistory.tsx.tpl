import React, { useRef, useEffect } from 'react';
import { MicroApp, Props as MicroAppProps } from './MicroApp';

export interface Props extends MicroAppProps {
  history?: never
}

export function MicroAppWithMemoHistory(componentProps: Props) {
  const history = useRef();
  const { url, ...rest } = componentProps;

  useEffect(() => {
    // push history for slave app when url property changed
    // the initial url will be ignored because the history ref has not been initialized
    if (history.current && url) {
      history.current.push(url);
    }
  }, [url]);

  return (
    <MicroApp
      {...rest}
      history={{
        type: 'memory',
        initialEntries: [url],
        initialIndex: 1,
      }}
      historyRef={history}
    />
  )
}
