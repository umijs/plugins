
import { history } from './.umi-test/core/history';
import qs from 'qs';

export const locale = {
  getLocale() {
    const { search } = window.location;
    const { locale = 'sk' } = qs.parse(search, { ignoreQueryPrefix: true });
    return locale;
  },
  setLocale({ lang, realReload, updater }) {
    history.push(`/?locale=${lang}`);
    updater();
  }
}
