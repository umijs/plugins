import React, { useEffect, useRef, useMemo } from 'react';

interface ExecutorProps {
  hook: () => any;
  onUpdate: (val: any) => void;
  namespace: string;
}

export default (props: ExecutorProps) => {
  const { hook, onUpdate, namespace } = props;

  const updateRef = useRef(onUpdate);
  updateRef.current = onUpdate;
  const initialLoad = useRef(false);

  let data: any;
  try {
    data = hook();
    if (
      process.env.NODE_ENV === 'development' &&
      typeof document !== 'undefined'
    ) {
      let count = Object.keys(
        ((window as any)._umi_useModel_dev_tool_log || {})[namespace] || {},
      ).length;
      (window as any)._umi_useModel_dev_tool = {
        ...(window as any)._umi_useModel_dev_tool,
        [namespace]: data,
      };
      (window as any)._umi_useModel_dev_tool_log = {
        ...(window as any)._umi_useModel_dev_tool_log,
        [namespace]: {
          ...((window as any)._umi_useModel_dev_tool_log || {})[namespace],
          [count]: data,
        },
      };
      window.dispatchEvent(
        new CustomEvent('_umi_useModel_update', {
          detail: {
            namespace,
            time: Date.now(),
            data,
            index: count,
          },
        }),
      );
    }
  } catch (e) {
    console.error(
      `plugin-model: Invoking '${namespace || 'unknown'}' model failed:`,
      e,
    );
  }

  // 首次执行时立刻返回初始值
  useMemo(() => {
    updateRef.current(data);
    initialLoad.current = false;
  }, []);

  // React 16.13 后 update 函数用 useEffect 包裹
  useEffect(() => {
    if (initialLoad.current) {
      updateRef.current(data);
    } else {
      initialLoad.current = true;
    }
  });

  return <></>;
};
