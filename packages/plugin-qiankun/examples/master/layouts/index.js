import { Breadcrumb, Layout, Menu } from 'antd';
import { connect } from 'dva';
import React from 'react';
import { Link } from 'umi';
import style from './style.less';

const { Header, Content, Footer } = Layout;

const renderBreadCrumb = pathname => {
  let arr = pathname.split('/').slice(1);
  if (arr[0] === '') {
    arr[0] = 'Home';
  }
  return (
    <Breadcrumb className={style.breadcrumb}>
      {arr.map(name => {
        return <Breadcrumb.Item key={name}>{name}</Breadcrumb.Item>;
      })}
    </Breadcrumb>
  );
};

@connect(({ base }) => ({ base }))
export default class extends React.PureComponent {
  constructor(props) {
    super(props);
    const { dispatch } = props;
    dispatch({
      type: 'base/getApps',
    });
  }

  render() {
    const { location, children, base } = this.props;
    const { name, apps } = base;
    const selectKey = '/' + location.pathname.split('/')[1];
    return (
      <Layout className={style.layout}>
        <Header>
          <div className={style.logo}>{name}</div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['home']}
            selectedKeys={[selectKey]}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="/">
              <Link to="/">Home</Link>
            </Menu.Item>
            {apps.map((app, index) => {
              if (index === 2) {
                return (
                  <Menu.Item key={app.to}>
                    <Link to="/app3/123">{app.name}</Link>
                  </Menu.Item>
                );
              }
              return (
                <Menu.Item key={app.to}>
                  <Link to={app.to}>{app.name}</Link>
                </Menu.Item>
              );
            })}
          </Menu>
        </Header>
        <Content className={style.content}>
          {renderBreadCrumb(location.pathname)}
          {children}
        </Content>
        <Footer className={style.footer}>
          Ant Design ©2019 Created by Ant UED
        </Footer>
      </Layout>
    );
  }
}
