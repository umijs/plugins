import React from 'react';
import { RawIntlProvider, getLocale, setIntl, getIntl } from './localeExports';

export function _onCreate() {
  const locale = getLocale();
  setIntl(locale);
}

export const _LocaleContainer = (props) => {
  const intl = getIntl();

  return (
    <RawIntlProvider value={intl}>
      {props.children}
    </RawIntlProvider>
  )
}
