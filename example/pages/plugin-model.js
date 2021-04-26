import React from 'react';
import { useModel, history } from 'umi';
import styles from './plugin-model.css';

export default () => {
  const { description: bar, setCount } = useModel('bar');
  // const setCount = useModel('bar', c => c.setCount);
  return (
    <div>
      <h1 className={styles.title} data-cy="model-count">
        Page plugin-model {bar}
      </h1>
      <button data-cy="model-add-btn" onClick={() => setCount((c) => c + 1)}>
        add
      </button>
      <button
        data-cy="go-to-plugin-initial-state"
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
