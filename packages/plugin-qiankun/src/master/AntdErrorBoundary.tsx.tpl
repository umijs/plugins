import React from "react";
import { Button, Result } from "antd";
{{#enableLocale}}
import { getLocale } from "umi";
{{/enableLocale}}

const defaultLocale = "en-US";

export const ErrorBoundary = ({ error }: { error: any }) => {
  console.error(error);
  let currentLocale = defaultLocale;
{{#enableLocale}}
  currentLocale = getLocale ? getLocale() : defaultLocale;
{{/enableLocale}}


  return (
    <Result
      status="500"
      title={
        currentLocale === defaultLocale
          ? "Whoops, something went wrong"
          : "出错了"
      }
      subTitle={
        currentLocale === defaultLocale
          ? "This page failed to load, please try again later"
          : "页面加载失败，请稍后重试"
      }
      extra={
        <Button type="primary" onClick={() => window.location.reload()}>
          {currentLocale === defaultLocale ? "Reload" : "再试一次"}
        </Button>
      }
    />
  );
};
