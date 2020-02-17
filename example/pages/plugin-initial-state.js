import React from 'react';
import { useModel } from 'umi';

export default () => {
  const { initialState, loading } = useModel('@@initialState');
  console.log(initialState, loading);
  return (
    <div>
      <h1>
        initial-state: {loading ? 'loading...' : JSON.stringify(initialState)}
      </h1>
    </div>
  );
};
