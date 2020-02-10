import React from 'react';
import { Typography, Button } from 'antd';
import history from '@@/history';
import './index.less';
import { IRouteLayoutConfig } from '../../types/interface.d';

interface ExceptionProps {
  exceptionImg: string | any;
  title: string | number;
  description: string;
  footer?: any;
}

function backToHome() {
  history.push('/');
}

const Exception = (props: ExceptionProps) => {
  const { exceptionImg, title, description, footer } = props;

  return (
    <div className="umi-plugin-layout-exception-container">
      <div className="umi-plugin-layout-exception-content">
        {typeof exceptionImg === 'string' ? (
          <img src={exceptionImg} width="438" alt="desc" />
        ) : (
          exceptionImg
        )}
        <div className="umi-plugin-layout-exception-rightContent">
          {isNaN(Number(title)) ? (
            <Typography.Title level={2}>{title}</Typography.Title>
          ) : (
            <Typography.Title>{title}</Typography.Title>
          )}
          <p className="umi-plugin-layout-exception-desc">{description}</p>
          {footer}
        </div>
      </div>
    </div>
  );
};

const Exception404 = () => (
  <Exception
    exceptionImg={
      <img
        src="https://img.alicdn.com/tfs/TB1_3MMg1H2gK0jSZJnXXaT1FXa-1323-801.png"
        width="438"
        alt="desc"
      />
    }
    title="404"
    description="抱歉，你访问的页面不存在"
    footer={
      <Button type="primary" onClick={backToHome}>
        返回首页
      </Button>
    }
  />
);

const Exception500 = () => (
  <Exception
    exceptionImg="https://img.alicdn.com/tfs/TB1Pt.Mg.z1gK0jSZLeXXb9kVXa-1446-795.png"
    title="500"
    description="抱歉，服务器出错了"
    footer={
      <Button type="primary" onClick={backToHome}>
        返回首页
      </Button>
    }
  />
);

const Exception403 = () => (
  <Exception
    exceptionImg={
      <img
        src="https://img.alicdn.com/tfs/TB1uK.QgW61gK0jSZFlXXXDKFXa-1311-825.png"
        width="438"
        alt="desc"
      />
    }
    title="403"
    description="抱歉，你无权访问该页面"
    footer={
      <Button type="primary" onClick={backToHome}>
        返回首页
      </Button>
    }
  />
);

/**
 * 异常路由处理组件
 * - 无权限
 * - 404
 */
const WithExceptionOpChildren = (
  children: React.ReactNode,
  currentPathConfig?: IRouteLayoutConfig,
) => {
  if (!currentPathConfig) {
    return <Exception404 />;
  }
  if (currentPathConfig.unAccessible) {
    return <Exception403 />;
  }
  return children;
};

export default Exception;

export { Exception404, Exception403, Exception500, WithExceptionOpChildren };
