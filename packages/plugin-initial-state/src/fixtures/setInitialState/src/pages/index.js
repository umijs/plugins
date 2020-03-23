import React from 'react';
import { useModel } from '../.umi-test/plugin-model/useModel';

export default function() {
  const { initialState ,setInitialState } = useModel('@@initialState') || {};
  return (
    <>
      <div data-testid="content">{initialState}</div>
      <button onClick={() => setInitialState('custom message')}>set</button>
    </>
  );
}
