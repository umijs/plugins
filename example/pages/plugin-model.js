import React from 'react';
import { useModel } from 'umi';
import styles from './plugin-model.css';

export default () => {
  const bar = useModel('bar', c => c.description);
  const setCount = useModel('bar', c => c.setCount);
  return (
    <div>
      <h1 className={styles.title}>Page plugin-model {bar}</h1>
      <button onClick={() => setCount(c => c + 1)}>add</button>
    </div>
  );
};
