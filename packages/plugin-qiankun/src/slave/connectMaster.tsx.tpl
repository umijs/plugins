import { useModel } from 'umi';
import React from 'react';
import { noop } from 'lodash';

const connectMaster = <T extends object>(Component: React.ComponentType<T>) => {
  return (props: T, ...rest: any[]) => {
    const masterProps = (useModel || noop)('@@qiankunStateFromMaster') || {};

    return <Component {...props} {...rest} {...masterProps} />;
  };
};

export {
  connectMaster
};
