import React, { Fragment } from 'react';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import { Icon } from 'antd';
import logo from './logo.svg';
import './style.less';

const links = [
  {
    key: 'help',
    title: formatMessage({ id: 'layout.user.link.help' }),
    href: ''
  },
  {
    key: 'privacy',
    title: formatMessage({ id: 'layout.user.link.privacy' }),
    href: ''
  },
  {
    key: 'terms',
    title: formatMessage({ id: 'layout.user.link.terms' }),
    href: ''
  }
];

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 2018 蚂蚁金服体验技术部出品
  </Fragment>
);

class UserLayout extends React.PureComponent {
  render() {
    const { children } = this.props;
    return (
      <div className="umi-block-dev">
        <div className="content">
          <div className="top">
            <div className="header">
              <Link to="/">
                <img alt="logo" className="logo" src={logo} />
                <span className="title">Ant Design</span>
              </Link>
            </div>
            <div className="desc">
              Ant Design 是西湖区最具影响力的 Web 设计规范
            </div>
          </div>
          {children}
        </div>
      </div>
    );
  }
}

export default UserLayout;
