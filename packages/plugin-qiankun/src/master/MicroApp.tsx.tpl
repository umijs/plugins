import { getMasterOptions } from '@@/plugin-qiankun/masterOptions';
import { FrameworkConfiguration, loadMicroApp, MicroApp as MicroAppType  } from 'qiankun';
import React, { useEffect, useRef } from 'react';

type Props = {
  name: string;
  settings?: FrameworkConfiguration;
  props?: Record<string, any>;
}

function findAppConfig(appName: string) {
  const { apps } = getMasterOptions();
  return apps.find((app: any) => app.name === appName);
}

function unmountMicroApp(microApp: MicroAppType) {
  const status = microApp.getStatus();
  if (status === 'MOUNTED') {
    microApp.unmount();
  }
}

export function MicroApp(componentProps: Props) {
  const { name, settings = {}, props = {} } = componentProps;
  const appConfig: any = findAppConfig(name);
  if (!appConfig) {
    throw new Error(
      `[@umijs/plugin-qiankun]: Can not find the configuration of ${name} app!`,
    );
  }

  const containerRef = useRef<HTMLDivElement>(null);

  let microApp: MicroAppType;
  useEffect(() => {
    microApp = loadMicroApp(
      {
        name,
        entry: appConfig.entry,
        container: containerRef.current!,
        props,
      },
      settings,
    );

    return () => unmountMicroApp(microApp);
  }, []);

  useEffect(() => {
    if (microApp.update) {
      const status = microApp.getStatus();
      if (status === 'MOUNTED') microApp.update(props);
    };

    return () => unmountMicroApp(microApp);
  }, Object.values(props));

  return <div ref={containerRef} />;
}
