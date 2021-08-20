import React from 'react';
import { Button, Result } from 'antd';
import { getLocale } from 'umi';

export const ErrorBoundary = () => {
  const currentLocale = getLocale ? getLocale() : 'en-US';

  return (
    <Result
      status="500"
      title={
        currentLocale === 'zh-CN' ? '出错了' : 'Whoops, something went wrong'
      }
      subTitle={
        currentLocale === 'zh-CN'
          ? '页面加载失败，请稍后重试'
          : 'This page failed to load, please try again later'
      }
      extra={
        <Button type="primary" onClick={() => window.location.reload()}>
          {currentLocale === 'zh-CN' ? '再试一次' : 'Reload'}
        </Button>
      }
    />
  );
};
