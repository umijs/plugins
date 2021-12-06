import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  useIntl,
  formatMessage,
  addLocale,
  getLocale,
  getAllLocales,
  setLocale,
  Access,
  useAccess,
} from 'umi';
import styles from './plugin-locale.css';

export default connect((state) => {
  return { count: state.count, foo: state.foo };
})(function (props) {
  const intl = useIntl();
  const access = useAccess();
  const [list, setList] = useState<string[]>(getAllLocales());

  useEffect(() => {
    // 动态增加新语言
    addLocale('zh-TW', {
      name: '妳好，{name}',
    });
    // 刷新列表
    setList(getAllLocales());
  }, []);

  const locale = getLocale();

  return (
    <div className={styles.normal}>
      <h1>当前语言：{locale}</h1>
      {list.map((locale) => (
        <a
          key={locale}
          onClick={() => {
            setLocale(locale, false);
          }}
          data-cy={`link-${locale}`}
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
      <button data-cy="locale-text">
        {formatMessage(
          {
            id: 'name',
          },
          {
            name: '过期 api',
          },
        )}
      </button>{' '}
      <button>
        {intl.formatMessage(
          {
            id: 'name',
          },
          {
            name: '旅行者',
          },
        )}
      </button>
      <div>
        <Access accessible={access.readArticle}>
          <button type="button">Read Article</button>
        </Access>
        <Access
          accessible={access.updateArticle()}
          fallback={<button type="button">Cannot Update Article</button>}
        >
          <button type="button">Update Article</button>
        </Access>
      </div>
    </div>
  );
});
