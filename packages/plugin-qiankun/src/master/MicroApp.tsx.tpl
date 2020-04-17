import { getMasterOptions } from '@@/plugin-qiankun/masterOptions';
import {
  FrameworkConfiguration,
  loadMicroApp,
  MicroApp as MicroAppType,
} from 'qiankun';
import React, { useEffect, useRef } from 'react';

type Props = {
  name: string;
  settings?: FrameworkConfiguration;
  base?: string;
  history?: string;
  getMatchedBase?: () => string;
} & Record<string, any>;

function unmountMicroApp(microApp?: MicroAppType) {
  if (microApp) {
    microApp.mountPromise.then(() => microApp.unmount());
  }
}

export function MicroApp(componentProps: Props) {
  const {
    masterHistoryType,
    apps = [],
    lifeCycles,
    ...globalSettings
  } = getMasterOptions() as any;

  const {
    name,
    settings: settingsFromProps = {},
    ...propsForParams
  } = componentProps;

  const containerRef = useRef<HTMLDivElement>(null);
  let microAppRef = useRef<MicroAppType>();

  const appConfig = apps.find((app: any) => app.name === name);
  if (!appConfig) {
    throw new Error(
      `[@umijs/plugin-qiankun]: Can not find the configuration of ${name} app!`,
    );
  }

  const { entry, props: propsFromConfig = {} } = appConfig;

  useEffect(() => {
    microAppRef.current = loadMicroApp(
      {
        name,
        entry,
        container: containerRef.current!,
        props: { ...propsFromConfig, ...propsForParams },
      },
      {
        ...globalSettings,
        ...settingsFromProps,
      },
    );

    return () => unmountMicroApp(microAppRef.current);
  }, []);

  useEffect(() => {
    if (microAppRef.current?.update) {
      const microApp = microAppRef.current!;
      const status = microApp.getStatus();
      if (status === 'MOUNTED') microApp.update({  ...propsFromConfig, ...propsForParams  });
    }

    return () => {};
  }, Object.values(propsForParams));

  return <div ref={containerRef} />;
}
