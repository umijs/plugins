import React from 'react';
import { useModel } from './.umi/useModel';

export default () => {
  const { counter, increment, decrement } = useModel('counter', d => d);
  return (<>
    <h2 data-testid="count">{counter}</h2>
    <button onClick={increment}>add</button>
    <button onClick={decrement}>minus</button>
  </>);
}
