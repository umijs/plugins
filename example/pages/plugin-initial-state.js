import React from 'react';
import { useModel } from 'umi';

export default () => {
  const { initialState, loading } = useModel('@@initialState');
  console.log(initialState, loading);
  return (
    <div>
      <h1 className={styles.title}>Page plugin-model {bar.description}</h1>
    </div>
  );
};
