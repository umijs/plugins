import React, { useMemo } from 'react';
import { Link, useModel, history, useIntl, InitialState } from 'umi';
import pathToRegexp from 'path-to-regexp';
import ProLayout from '@ant-design/pro-layout';
import './style.less';
import ErrorBoundary from '../component/ErrorBoundary';
import useRightContent from './useRightContent';
import { WithExceptionOpChildren } from '../component/Exception';
import getLayoutConfigFromRoute from '../utils/getLayoutConfigFromRoute';
import getMenuDataFromRoutes from '../utils/getMenuFromRoute';
import { MenuItem } from '../types/interface.d';
import logo from '../assets/logo.svg';

const BasicLayout = (props: any) => {
  const { children, userConfig, location } = props;
  const initialInfo = (useModel && useModel('@@initialState')) || {
    initialState: undefined,
    loading: false,
    setInitialState: null,
  }; // plugin-initial-state 未开启
  const { initialState, loading, setInitialState } = initialInfo;
  const _routes = require('@@/core/routes').routes;
  // 国际化插件并非默认启动
  const intl = useIntl && useIntl();
  const rightContentRender = useRightContent(
    userConfig,
    loading,
    initialState,
    setInitialState,
  );
  const layoutConfig = getLayoutConfigFromRoute(_routes);
  const patchMenus: (ms: MenuItem[], initialInfo: InitialState) => MenuItem[] =
    userConfig.patchMenus || ((ms: MenuItem[]): MenuItem[] => ms);
  const menus = useMemo(
    () => patchMenus(getMenuDataFromRoutes(_routes[0].routes), initialInfo),
    [initialState],
  );

  // layout 是否渲染相关
  const pathName = location.pathname;
  const layoutRender: any = {};

  // 动态路由匹配
  const currentMatchPaths = Object.keys(layoutConfig).filter(item =>
    pathToRegexp(`${item}(.*)`).test(pathName),
  );

  const currentPathConfig = currentMatchPaths.length
    ? layoutConfig[currentMatchPaths[currentMatchPaths.length - 1]]
    : undefined;

  if (currentPathConfig && currentPathConfig.hideMenu) {
    layoutRender.menuRender = false;
  }

  if (currentPathConfig && currentPathConfig.hideNav) {
    layoutRender.headerRender = false;
  }

  if (currentPathConfig && currentPathConfig.hideLayout) {
    layoutRender.pure = true;
  }

  return (
    <ProLayout
      title={userConfig.name || userConfig.title}
      className="umi-plugin-layout-main"
      navTheme="dark"
      siderWidth={256}
      onMenuHeaderClick={e => {
        e.stopPropagation();
        e.preventDefault();
        history.push('/');
      }}
      menu={{ locale: userConfig.locale }}
      menuDataRender={() => menus}
      formatMessage={intl && intl.formatMessage}
      logo={
        (initialState && initialState.avatar) || logo // 默认 logo
      }
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || menuItemProps.children) {
          return defaultDom;
        }
        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      disableContentMargin
      rightContentRender={rightContentRender}
      fixSiderbar
      fixedHeader
      {...userConfig}
      {...props}
      {...layoutRender}
    >
      <ErrorBoundary>
        <WithExceptionOpChildren currentPathConfig={currentPathConfig}>
          {userConfig.childrenRender
            ? userConfig.childrenRender(children)
            : children}
        </WithExceptionOpChildren>
      </ErrorBoundary>
    </ProLayout>
  );
};

export default BasicLayout;
