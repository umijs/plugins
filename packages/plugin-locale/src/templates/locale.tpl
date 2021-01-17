import React from 'react';
import EventEmitter from 'events';
{{#Antd}}
import { ConfigProvider } from 'antd';
{{/Antd}}

{{#MomentLocales.length}}
import moment from 'moment';
{{#MomentLocales}}
import 'moment/locale/{{.}}';
{{/MomentLocales}}
{{/MomentLocales.length}}
import { RawIntlProvider, getLocale, getDirection , setIntl, getIntl, localeInfo } from './localeExports';

// @ts-ignore
export const event = new EventEmitter();
event.setMaxListeners(5);
export const LANG_CHANGE_EVENT = Symbol('LANG_CHANGE');

export function _onCreate() {
  const locale = getLocale();
  {{#MomentLocales.length}}
  if (moment?.locale) {
    moment.locale(localeInfo[locale]?.momentLocale || '{{{DefaultMomentLocale}}}');
  }
  {{/MomentLocales.length}}
  setIntl(locale);
}

export const _LocaleContainer = (props:any) => {
  const [locale, setLocale] = React.useState(() => getLocale());
  const [intl, setContainerIntl] = React.useState(() => getIntl(locale, true));

  const handleLangChange = (locale:string) => {
    {{#MomentLocales.length}}
    if (moment?.locale) {
      moment.locale(localeInfo[locale]?.momentLocale || 'en');
    }
    {{/MomentLocales.length}}
    setLocale(locale);
    setContainerIntl(getIntl(locale));
  };

  React.useLayoutEffect(() => {
    event.on(LANG_CHANGE_EVENT, handleLangChange);
    {{#Title}}
    // avoid reset route title
    if (typeof document !== 'undefined' && intl.messages['{{.}}']) {
      document.title = intl.formatMessage({ id: '{{.}}' });
    }
    {{/Title}}
    return () => {
      event.off(LANG_CHANGE_EVENT, handleLangChange);
    };
  }, []);

  {{#Antd}}
  const defaultAntdLocale = {
    {{#DefaultAntdLocales}}
    ...require('{{{.}}}').default,
    {{/DefaultAntdLocales}}
  }
  const direcition = getDirection();

  return (
    <ConfigProvider  direction={direcition} locale={localeInfo[locale]?.antd || defaultAntdLocale}>
      <RawIntlProvider value={intl}>{props.children}</RawIntlProvider>
    </ConfigProvider>
  )
  {{/Antd}}
  {{^Antd}}
  return <RawIntlProvider value={intl}>{props.children}</RawIntlProvider>;
  {{/Antd}}
};
