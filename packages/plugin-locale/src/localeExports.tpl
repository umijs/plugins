import {
  createIntl,
  IntlShape,
  MessageDescriptor,
} from '{{{ reactIntlPkgPath }}}';
import { event, LANG_CHANGE_EVENT } from './locale';
import warning from '{{{ warningPkgPath }}}';

export * from '{{{ reactIntlPkgPath }}}';

let g_intl: IntlShape;

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

/**
 * 增加一个新的国际化语言
 * @param name 语言的 key
 * @param messages 对应的枚举对象
 * @param momentLocale moment 的语言设置
 */
export const addLocale = (
  name: string,
  messages: Object,
  momentLocale = '',
) => {
  if (!name) {
    return;
  }
  // 可以合并
  const mergeMessages = localeInfo[name]?.messages
    ? Object.assign({}, localeInfo[name].messages, messages)
    : messages;

  localeInfo[name] = {
    messages: mergeMessages,
    locale: name,
    momentLocale: momentLocale,
  };
};

/**
 * 获取当前的 intl 对象，可以在 node 中使用
 * @param locale 需要切换的语言类型
 * @param changeIntl 是否不使用 g_intl
 * @returns IntlShape
 */
export const getIntl = (locale?: string, changeIntl?: boolean) => {
  // 如果全局的 g_intl 存在，且不是 setIntl 调用
  if (g_intl && !changeIntl && !locale) {
    return g_intl;
  }
  // 如果存在于 localeInfo 中
  if (localeInfo[locale]) {
    return createIntl(localeInfo[locale]);
  }
  // 不存在需要一个报错提醒
  warning(
    !!localeInfo[locale],
    `The current popular language does not exist, please check the locale folder!`,
  );
  // 使用 zh-CN
  if (localeInfo[DefaultLocale]) return createIntl(localeInfo[DefaultLocale]);

  // 如果还没有，返回一个空的
  return createIntl({
    name: DefaultLocale,
    messages: {},
  });
};

/**
 * 切换全局的 intl 的设置
 * @param locale 语言的key
 */
export const setIntl = (locale: string) => {
  g_intl = getIntl(locale, true);
};

/**
 * 获取当前选择的语言
 * @returns string
 */
export const getLocale = () => {
  // support SSR
  const { g_lang } = window;
  const lang =
    typeof localStorage !== 'undefined'
      ? window.localStorage.getItem('umi_locale')
      : '';
  const isNavigatorLanguageValid =
    typeof navigator !== 'undefined' && typeof navigator.language === 'string';
  const browserLang = isNavigatorLanguageValid
    ? navigator.language.split('-').join('{{BaseSeparator}}')
    : '';
  return lang || g_lang || browserLang;
};

/**
 * 切换语言
 * @param lang 语言的 key
 * @param realReload 是否刷新页面，默认刷新
 * @returns string
 */
export const setLocale = (lang: string, realReload: boolean = true) => {
  const localeExp = new RegExp(`^([a-z]{2}){{BaseSeparator}}?([A-Z]{2})?$`);
  if (lang !== undefined && !localeExp.test(lang)) {
    // for reset when lang === undefined
    throw new Error('setLocale lang format error');
  }
  if (getLocale() !== lang) {
    if (typeof window.localStorage !== 'undefined') {
      window.localStorage.setItem('umi_locale', lang || '');
    }
    setIntl(lang);
    if (realReload) {
      window.location.reload();
    } else {
      event.emit(LANG_CHANGE_EVENT, lang);
      // chrome 不支持这个事件。所以人肉触发一下
      if (window.dispatchEvent) {
        const event = new Event('languagechange');
        window.dispatchEvent(event);
      }
    }
  }
};

let firstWaring = true;

/**
 * intl.formatMessage 的语法糖
 * @deprecated 使用此 api 会造成切换语言的时候无法自动刷新，请使用 useIntl 或 injectIntl
 * @param descriptor { id : string, defaultMessage : string }
 * @param values { [key:string] : string }
 * @returns string
 */
export const formatMessage: IntlShape['formatMessage'] = (
  descriptor: MessageDescriptor,
  values: any,
) => {
  if (firstWaring) {
    warning(
      false,
      `Using this API will cause automatic refresh when switching languages, please use useIntl or injectIntl.

使用此 api 会造成切换语言的时候无法自动刷新，请使用 useIntl 或 injectIntl。

http://j.mp/37Fkd5Q
      `,
    );
    firstWaring = false;
  }
  return g_intl.formatMessage(descriptor, values);
};

/**
 * 获取语言列表
 * @returns string[]
 */
export const getAllLocales = () => Object.keys(localeInfo);
