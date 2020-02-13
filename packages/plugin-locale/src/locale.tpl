import React from 'react';
import EventEmitter from 'events';
import { IntlProvider, getLocale, setIntl, getIntl } from './localeExports';

export const event = new EventEmitter();
event.setMaxListeners(5);
export const LANG_CHANGE_EVENT = Symbol('LANG_CHANGE');

export function _onCreate() {
  const locale = getLocale();
  setIntl(locale);
}

export const _LocaleContainer = props => {
  const [intl, setContainerIntl] = React.useState(() => getIntl());

  const handleLangChange = () => {
    setContainerIntl(getIntl());
  };

  React.useEffect(() => {
    event.on(LANG_CHANGE_EVENT, handleLangChange);
    return () => {
      event.off(LANG_CHANGE_EVENT, handleLangChange);
    };
  }, []);

  return <IntlProvider value={intl}>{props.children}</IntlProvider>;
};
