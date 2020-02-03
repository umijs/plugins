import React from 'react';
import { useModel } from 'umi';
import styles from './plugin-model.css';

export default () => {
  const bar = useModel('bar');
  return (
    <div>
      <h1 className={styles.title}>Page plugin-model {bar.description}</h1>
    </div>
  );
};
