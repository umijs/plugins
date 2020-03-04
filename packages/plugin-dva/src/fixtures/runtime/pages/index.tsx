import React from 'react';
import styles from './index.less';
import { connect } from 'dva';

export default connect(state => ({
  products: state.products,
}))((props) => {
  return (
    <div>
      <ul>
        {props.products.map(product => <li key={product.id}>{product.name}</li>)}
      </ul>
    </div>
  );
})
