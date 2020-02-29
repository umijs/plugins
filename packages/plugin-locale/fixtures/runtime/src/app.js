
import { history } from './.umi-test/core/history';
import queryString from 'queryString';

export const locale = {
  getLocale() {
    const { search } = window.location;
    const { locale = 'sk' } = queryString.parse(search);
    return locale;
  },
  setLocale({ lang, realReload, updater }) {
    history.push(`/?locale=${lang}`);
    updater();
  }
}
