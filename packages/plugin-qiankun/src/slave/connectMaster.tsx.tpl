import { useModel } from 'umi';
import React from 'react';

const connectMaster = <T extends object>(Component: React.ComponentType<T>) => {
  return (props: T, ...rest: any[]) => {
    const masterProps = useModel('@@qiankunStateFromMaster') || {};

    return <Component {...props} {...rest} {...masterProps} />;
  };
};

export {
  connectMaster
};
