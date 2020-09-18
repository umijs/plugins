import React, { useRef, useEffect, useCallback } from 'react';
import { MicroApp, Props as MicroAppProps } from './MicroApp';

export interface Props extends MicroAppProps {
  history?: never
}

export function MicroAppWithMemoHistory(componentProps: Props) {
  const { url, ...rest } = componentProps;
  const history = useRef();
  const historyOpts = useRef({
    type: 'memory',
    initialEntries: [url],
    initialIndex: 1,
  });
  const historyInitHandler = useCallback(h => history.current = h, []);

  useEffect(() => {
    // push history for slave app when url property changed
    // the initial url will be ignored because the history has not been initialized
    if (history.current && url) {
      history.current.push(url);
    }
  }, [url]);

  return (
    <MicroApp
      {...rest}
      history={historyOpts.current}
      onHistoryInit={historyInitHandler}
    />
  )
}
