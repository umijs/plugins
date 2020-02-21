import React from 'react';
import EventEmitter from 'events';
{{#MomentModule}}
import moment from '{{{ MomentModule }}}';
{{/MomentModule}}
{{#MomentLocalePaths}}
import '{{{.}}}';
{{/MomentLocalePaths}}
import { RawIntlProvider, getLocale, setIntl, getIntl, localeInfo } from './localeExports';

export const event = new EventEmitter();
event.setMaxListeners(5);
export const LANG_CHANGE_EVENT = Symbol('LANG_CHANGE');

export function _onCreate() {
  const locale = getLocale();
  {{#MomentModule}}
  if (localeInfo[locale]?.momentLocale && moment?.locale) {
    moment.locale(localeInfo[locale].momentLocale);
  }
  {{/MomentModule}}
  setIntl(locale);
}

export const _LocaleContainer = props => {
  const [intl, setContainerIntl] = React.useState(() => getIntl());

  const handleLangChange = (locale) => {
    {{#MomentModule}}
    if (localeInfo[locale]?.momentLocale && moment?.locale) {
      moment.locale(localeInfo[locale].momentLocale);
    }
    {{/MomentModule}}
    setContainerIntl(getIntl(locale));
  };

  React.useLayoutEffect(() => {
    event.on(LANG_CHANGE_EVENT, handleLangChange);
    return () => {
      event.off(LANG_CHANGE_EVENT, handleLangChange);
    };
  }, []);

  return <RawIntlProvider value={intl}>{props.children}</RawIntlProvider>;
};
