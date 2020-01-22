
import { createIntl } from 'react-intl';

let g_intl;

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

const getIntl = (locale) => {
  return g_intl || createIntl(localeInfo[locale]);
}

const setIntl = (locale) => {
  if (localeInfo[locale]) {
    g_intl = createIntl(localeInfo[locale]);
  }
}

export const getLocale = () => {
  // support SSR
  const { g_lang } = window;
  const lang = typeof localStorage !== 'undefined' ? window.localStorage.getItem('umi_locale') : '';
  const isNavigatorLanguageValid =
    typeof navigator !== 'undefined' && typeof navigator.language === 'string';
  const browserLang = isNavigatorLanguageValid
    ? navigator.language.split('-').join('{{BaseSeparator}}')
    : '';
  return lang || g_lang || browserLang;
}

export const setLocale = (lang, realReload = true) => {
  const localeExp = new RegExp(`^([a-z]{2}){{BaseSeparator}}?([A-Z]{2})?$`);
  if (lang !== undefined && !localeExp.test(lang)) {
    // for reset when lang === undefined
    throw new Error('setLocale lang format error');
  }
  if (getLocale() !== lang) {
    if (typeof window.localStorage !== 'undefined') {
      window.localStorage.setItem('umi_locale', lang || '');
    }
    if (realReload) {
      window.location.reload();
    }
    // chrome 不支持这个事件。所以人肉触发一下
    if (window.dispatchEvent) {
      const event = new Event('languagechange');
      window.dispatchEvent(event);
    }
    setIntl(lang);
  }
}

export * from 'react-intl';
