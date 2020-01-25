import { Button } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import styles from './index.css';

export default connect(state => {
  return { count: state.count, foo: state.foo };
})(function(props) {
  return (
    <div className={styles.normal}>
      <h1>
        Page index {props.count} {props.foo + 2}
      </h1>
      <Button type="primary">
        {formatMessage(
          {
            id: 'test',
          },
          {
            name: 'antd',
          },
        )}
      </Button>
    </div>
  );
});
