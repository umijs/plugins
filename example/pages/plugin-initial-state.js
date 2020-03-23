import React from 'react';
import { useModel } from 'umi';

export default () => {
  let { initialState = {}, loading } = {};
  try {
    ({ initialState = {}, loading } = useModel
      ? useModel('@@initialState')
      : {});
  } catch (e) {
    initialState = 'plugin disabled';
  }

  console.log(initialState, loading);
  return (
    <div>
      <h1>
        initial-state: {loading ? 'loading...' : JSON.stringify(initialState)}
      </h1>
    </div>
  );
};
