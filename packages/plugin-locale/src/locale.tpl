import { useState, useEffect } from 'react';
import {
  RawIntlProvider,
  createIntl,
} from 'react-intl';

// polyfill
// if (!Intl.PluralRules) {
//   require('@formatjs/intl-pluralrules/polyfill');
// }

// if (!Intl.RelativeTimeFormat) {
//   require('@formatjs/intl-relativetimeformat/polyfill');
// }


let intl = null;

const localeInfo = {
  {{#LocaleList}}
  '{{name}}': {
    messages: {
      {{#paths}}...((locale) => locale.__esModule ? locale.default : locale)(require('{{{.}}}')),{{/paths}}
    },
    locale: '{{name}}',
    momentLocale: '{{MomentLocale}}',
  },
  {{/LocaleList}}
};


export function _onCreate() {
  if (
    typeof localStorage !== 'undefined'
    && localStorage.getItem('umi_locale')
    && localeInfo[localStorage.getItem('umi_locale')]
  ) {
    setIntl(localStorage.getItem('umi_locale'));
  } else if (
    typeof navigator !== 'undefined'
    && localeInfo[navigator.language]
  ) {
    setIntl(navigator.language);
  } else {
    setIntl('{{ defaultLocale }}');
  }
}

export const getIntl = () => {
  return intl;
}

export const setIntl = (locale) => {
  intl = createIntl(localeInfo[locale]);
}

export * from 'react-intl';

export const _LocaleContainer = (props) => {
  const [locale, setLocale] = useState('{{ defaultLocale }}');
  console.log('intl', intl);
  useEffect(() => {
    setIntl(locale)
  }, [locale]);

  return (
    <RawIntlProvider value={intl}>
      {props.children}
    </RawIntlProvider>
  )
}
