import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { connect } from 'dva';
import { useIntl, addLocale, getLocale, getAllLocales, setLocale } from 'umi';
import styles from './index.css';

export default connect(state => {
  return { count: state.count, foo: state.foo };
})(function(props) {
  const intl = useIntl();
  const [list, setList] = useState<string[]>(getAllLocales());

  useEffect(() => {
    addLocale('zh-TW', {
      name: '妳好，{name}',
    });
    setList(getAllLocales());
  }, []);

  const locale = getLocale();

  return (
    <div className={styles.normal}>
      <h1>当前语言：{locale}</h1>
      {list.map(locale => (
        <a
          onClick={() => {
            setLocale(locale, false);
          }}
          style={{
            margin: 8,
          }}
        >
          {locale}
        </a>
      ))}
      <h1>
        Page index {props.count} {props.foo + 2}
      </h1>
      <Button type="primary">
        {intl.formatMessage(
          {
            id: 'name',
          },
          {
            name: '旅行者',
          },
        )}
      </Button>
    </div>
  );
});
