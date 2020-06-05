import { getMasterOptions } from '@@/plugin-qiankun/masterOptions';
import {
  FrameworkConfiguration,
  loadMicroApp,
  MicroApp as MicroAppType,
} from 'qiankun';
{{#hasAntd}}
import { Spin } from 'antd';
{{/hasAntd}}
import React, { useEffect, useRef, useState } from 'react';

type Props = {
  name: string;
  settings?: FrameworkConfiguration;
  base?: string;
  history?: string;
  getMatchedBase?: () => string;
  loadingComponent?: React.ReactNode;
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
    loadingComponent,
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
    if (microAppRef.current?.update) {
      const microApp = microAppRef.current!;
      const status = microApp.getStatus();
      if (status === 'MOUNTED') microApp.update({  ...propsFromConfig, ...propsForParams, setLoading });
    }

    return () => {};
  }, Object.values(propsForParams));

  return (
    {{#hasAntd}}
      {Boolean(loadingComponent) ? (
        <div>
          { loading && loadingComponent }
          <div ref={containerRef} />
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          <Spin
            spinning={loading}
            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
          >
            <div ref={containerRef} />
          </Spin>
        </div>
      )}
    {{/hasAntd}}
    {{^hasAntd}}
      <div>
        { loading && Boolean(loadingComponent) && loadingComponent }
        <div ref={containerRef} />
      </div>
    {{/hasAntd}}
  );
}
