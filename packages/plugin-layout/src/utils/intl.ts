import { useIntl, getLocale } from 'umi';
import zhCN from '../locale/zh-CN';
import enUS from '../locale/en-US';

export enum LOCALES {
  'zh-CN' = '中文',
  'en-US' = 'English',
}

export enum LOCALES_ICON {
  'zh-CN' = '🇨🇳',
  'en-US' = '🇺🇸',
}

export type ILocale = keyof typeof LOCALES;

/** 处理默认 UI 的国际化函数 */
export function intl({
  id,
  value = {},
}: {
  id: string;
  value?: { [key: string]: any };
}) {
  const intl = useIntl();
  const localeMessages: { [key: string]: string } =
    getLocale() === 'zh-CN' ? zhCN : enUS;
  return intl.formatMessage({ id }, value) || localeMessages[id] || id;
}
