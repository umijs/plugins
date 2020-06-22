import { getMasterOptions } from '@@/plugin-qiankun/masterOptions';
import {
  FrameworkConfiguration,
  loadMicroApp,
  MicroApp as MicroAppType,
} from 'qiankun';
import React, { useEffect, useRef, useState } from 'react';

type Props = {
  name: string;
  settings?: FrameworkConfiguration;
  base?: string;
  history?: string;
  getMatchedBase?: () => string;
  loader?: (loading: boolean) => React.ReactNode;
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
    loader,
    ...propsForParams
  } = componentProps;

  const containerRef = useRef<HTMLDivElement>(null);
  let microAppRef = useRef<MicroAppType>();
  const [ loading, setLoading ] = useState(true);

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
        props: { ...propsFromConfig, ...propsForParams, setLoading },
      },
      {
        ...globalSettings,
        ...settingsFromProps,
      },
    );

    return () => unmountMicroApp(microAppRef.current);
  }, []);

  useEffect(() => {
    const microApp = microAppRef.current;
    if (microApp?.update) {
      const status = microApp.getStatus();
      if (status === 'MOUNTED') {
        const props = {  ...propsFromConfig, ...propsForParams, setLoading };
        microApp.update(props);

        if (process.env.NODE_ENV === 'development') {
          console.info(`[@umijs/plugin-qiankun] MicroApp ${name} is updating with props: `, props);
        }
      }
    }

    return () => {};
  }, Object.values(propsForParams));

  return (
    <div>
      { Boolean(loader) && loader(loading) }
      <div ref={containerRef} />
    </div>
  );
}
