import React from 'react';
import { useModel, history } from 'umi';
import styles from './plugin-model.css';

export default () => {
  const { description: bar, setCount } = useModel('bar');
  // const setCount = useModel('bar', c => c.setCount);
  return (
    <div>
      <h1 className={styles.title}>Page plugin-model {bar}</h1>
      <button onClick={() => setCount(c => c + 1)}>add</button>
      <button
        onClick={() => {
          setCount(999);
          history.push('plugin-initial-state');
        }}
      >
        change state and navigate away
      </button>
    </div>
  );
};
