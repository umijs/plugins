import React from 'react';
import { useModel } from './.umi/useModel';

export default () => {
  const { switchRole } = useModel('auth');
  const { message, initial } = useModel('message');
  return (
    <>
      <h2 data-testid="message">{message}</h2>
      <h2 data-testid="initial">{initial}</h2>
      <button onClick={switchRole}>switch</button>
    </>
  );
};
