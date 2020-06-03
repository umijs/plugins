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
  hideMenu,
  showMenu,
  hideNav,
  showNav,
  hideFooter,
  showFooter,
  hideLayout,
  showLayout,
} from 'umi';
import { Table } from 'antd';
import styles from './index.css';

export default connect(state => {
  return { count: state.count, foo: state.foo };
})(function(props) {
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
      {list.map(locale => (
        <a
          key={locale}
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
      <button>
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
      <div>
        <button onClick={() => hideMenu()}>隐藏侧边栏</button>
        <button onClick={() => showMenu()}>展示侧边栏</button>
      </div>
      <div>
        <button onClick={() => hideNav()}>隐藏导航</button>
        <button onClick={() => showNav()}>展示导航</button>
      </div>
      <div>
        <button onClick={() => hideFooter()}>隐藏 footer</button>
        <button onClick={() => showFooter()}>展示 footer</button>
      </div>
      <div>
        <button onClick={() => hideLayout()}>隐藏 layout</button>
        <button onClick={() => showLayout()}>展示 layout</button>
      </div>
    </div>
  );
});
