import React, { useState } from 'react';
import logo from './logo.svg';
import { BasicLayout, SettingDrawer } from '@ant-design/pro-layout';
import SelectLang from './SelectLang';

export default props => {
  const { children } = props;
  const [settings, changeSetting] = useState({});
  return (
    <React.Fragment>
      <BasicLayout
        logo={logo}
        {...props}
        {...settings}
        rightContentRender={props => <SelectLang {...props} />}
      >
        {children}
      </BasicLayout>
      <SettingDrawer
        settings={settings}
        onSettingChange={settings => changeSetting(settings)}
      />
    </React.Fragment>
  );
};
