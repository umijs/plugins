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
