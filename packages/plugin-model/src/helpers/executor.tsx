import React from 'react';

interface ExecutorProps {
  hook: () => any;
  onUpdate: (val: any) => void;
  namespace: string;
}

export default (props: ExecutorProps) => {
  const { hook, onUpdate, namespace } = props;
  try {
    const data = hook();
    onUpdate(data);
  } catch (e) {
    console.error(
      `plugin-model: Invoking '${namespace || 'unknown'}' model failed:`,
      e,
    );
  }

  return <></>;
};
