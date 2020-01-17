import { Button } from 'antd';
import { connect } from 'dva';
import styles from './index.css';

export default connect(state => {
  return { count: state.count };
})(function(props) {
  return (
    <div className={styles.normal}>
      <h1>Page index {props.count}</h1>
      <Button type="primary">Hi</Button>
    </div>
  );
});
