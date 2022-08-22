import React, { useState,useMemo } from 'react';
// @ts-ignore
import { Link, useModel, history{{#hasAccess}}, traverseModifyRoutes, useAccess {{/hasAccess}} } from 'umi';
import ProLayout, {
  ProLayoutProps,
} from "@ant-design/pro-layout";
import './style.less';
// @ts-ignore
import renderRightContent from '@@/plugin-layout/renderRightContent';
import { WithExceptionOpChildren } from '../component/Exception';
import { getMatchMenu, MenuDataItem, transformRoute } from '@umijs/route-utils';
// @ts-ignore
import logo from '../component/logo';
import getLayoutRenderConfig from './getLayoutRenderConfig';

const BasicLayout = (props: any) => {
  const { children, userConfig = {}, location, route, ...restProps } = props;
  const initialInfo = (useModel && useModel('@@initialState')) || {
    initialState: undefined,
    loading: false,
    setInitialState: null,
  };

  // plugin-initial-state 未开启
  const { initialState, loading, setInitialState } = initialInfo;

  const currentPathConfig = useMemo(() => {
    const { menuData } = transformRoute(
      props?.route?.routes || [],
      undefined,
      undefined,
      true,
    );
    // 动态路由匹配
    const currentPathConfig = getMatchMenu(location.pathname, menuData).pop();
   return currentPathConfig || {};
  },[location?.pathname, props?.route?.routes]);

  // layout 是否渲染相关
  const layoutRestProps: ProLayoutProps & {
    rightContentRender?:
      | false
      | ((
          props: ProLayoutProps,
          dom: React.ReactNode,
          config: any,
        ) => React.ReactNode);
  } = {
    itemRender: (route) => <Link to={route.path}>{route.breadcrumbName}</Link>,
    ...userConfig,
    ...restProps,
    ...getLayoutRenderConfig(currentPathConfig as any ||{}),
  };

{{#hasAccess}}
  const access = useAccess?.();
{{/hasAccess}}

  return (
    <ProLayout
      route={route}
      location={location}
      title={userConfig?.name || userConfig?.title}
      navTheme="dark"
      siderWidth={256}
      onMenuHeaderClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        history.push('/');
      }}
      menu={ { locale: userConfig.locale } }
      // 支持了一个 patchMenus，其实应该用 menuDataRender
      menuDataRender={
        userConfig.patchMenus
          ? (menuData) => userConfig?.patchMenus(menuData, initialInfo)
          : undefined
      }
      formatMessage={userConfig?.formatMessage}
      logo={logo}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl) {
          return defaultDom;
        }
        if (menuItemProps.path && location.pathname !== menuItemProps.path) {
          return (
            <Link to={menuItemProps.path} target={menuItemProps.target}>
              {defaultDom}
            </Link>
          );
        }
        return defaultDom;
      }}
      disableContentMargin
      fixSiderbar
      fixedHeader
{{#hasAccess}}
      postMenuData={
        traverseModifyRoutes
          ? (menuData) => traverseModifyRoutes?.(menuData, access)
          : undefined
      }
{{/hasAccess}}
      {...layoutRestProps}
      rightContentRender={
        // === false 应该关闭这个功能
        layoutRestProps?.rightContentRender !== false &&
        ((layoutProps) => {
          const dom = renderRightContent?.(
            userConfig,
            loading,
            initialState,
            setInitialState,
          );
          if (layoutRestProps.rightContentRender) {
            return layoutRestProps.rightContentRender(layoutProps, dom, {
              userConfig,
              loading,
              initialState,
              setInitialState,
            });
          }
          return dom;
        })
      }
    >
      <WithExceptionOpChildren
        noFound={userConfig?.noFound}
        unAccessible={userConfig?.unAccessible}
        currentPathConfig={currentPathConfig}
      >
        {userConfig.childrenRender
          ? userConfig.childrenRender(children, props)
          : children}
      </WithExceptionOpChildren>
    </ProLayout>
  );
};

export default BasicLayout;
