import styles from './index.css';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';

import React from 'react';

const Welcome = () => (
  <div style={{ textAlign: 'center' }} className={styles.normal}>
    Want to add more pages? Please refer to{' '}
    <a
      href="https://pro.ant.design/docs/block-cn"
      target="_blank"
      rel="noopener noreferrer"
    >
      use block
    </a>
    {formatMessage({ id: '.', defaultMessage: '.' })}
  </div>
);

export default connect(({ test }) => ({
  test
}))(Welcome);
