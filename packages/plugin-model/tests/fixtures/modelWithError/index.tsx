import React from 'react';
import { useModel } from './.umi/useModel';

export default () => {
  const ret = useModel('name');
  return (<>
    <h2 data-testid="count">{`${ret}`}</h2>
  </>);
}
