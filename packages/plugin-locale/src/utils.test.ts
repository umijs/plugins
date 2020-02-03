import { Service } from 'umi';
import { join } from 'path';
import { getLocaleList, exactLocalePaths } from './utils';

describe('utils', () => {
  describe('getLocaleList', () => {
    it('base-separator', async () => {
      const service = new Service({
        cwd: join(__dirname, '../fixtures/base-separator'),
        plugins: [],
      });
      await service.init();
      const { absSrcPath, absPagesPath } = service.paths;
      const opts = {
        localeFolder: service.config?.singular ? 'locale' : 'locales',
        separator: service.config?.locale?.baseSeparator,
        absSrcPath,
        absPagesPath,
      };
      const list = getLocaleList(opts);
      expect(list).toEqual([
        {
          lang: 'en',
          country: 'US',
          name: 'en_US',
          paths: [
            `${absSrcPath}/locales/en_US.js`,
            `${absPagesPath}/temp/locales/en_US.js`,
          ],
          momentLocale: '',
        },
        {
          lang: 'sk',
          country: 'SK',
          name: 'sk',
          paths: [
            `${absSrcPath}/locales/sk.js`,
            `${absPagesPath}/temp/locales/sk.js`,
          ],
          momentLocale: 'sk',
        },
        {
          lang: 'zh',
          country: 'CN',
          name: 'zh_CN',
          paths: [
            `${absSrcPath}/locales/zh_CN.js`,
            `${absPagesPath}/temp/locales/zh_CN.js`,
          ],
          momentLocale: 'zh-cn',
        },
      ]);

      expect(exactLocalePaths(list)).toEqual([
        `${absSrcPath}/locales/en_US.js`,
        `${absPagesPath}/temp/locales/en_US.js`,
        `${absSrcPath}/locales/sk.js`,
        `${absPagesPath}/temp/locales/sk.js`,
        `${absSrcPath}/locales/zh_CN.js`,
        `${absPagesPath}/temp/locales/zh_CN.js`,
      ]);
    });

    it('multiple-ext', async () => {
      const service = new Service({
        cwd: join(__dirname, '../fixtures/multiple-ext'),
        plugins: [],
      });
      await service.init();
      const { absSrcPath, absPagesPath } = service.paths;
      const opts = {
        localeFolder: service.config?.singular ? 'locale' : 'locales',
        separator: service.config?.locale?.baseSeparator,
        absSrcPath,
        absPagesPath,
      };
      const list = getLocaleList(opts);
      expect(list).toEqual([
        {
          lang: 'en',
          country: 'US',
          name: 'en-US',
          paths: [
            `${absSrcPath}/locale/en-US.js`,
            `${absPagesPath}/temp/locale/en-US.js`,
          ],
          momentLocale: '',
        },
        {
          lang: 'sk',
          country: 'SK',
          name: 'sk',
          paths: [
            `${absSrcPath}/locale/sk.json`,
            `${absPagesPath}/temp/locale/sk.json`,
          ],
          momentLocale: 'sk',
        },
        {
          lang: 'zh',
          country: 'CN',
          name: 'zh-CN',
          paths: [
            `${absSrcPath}/locale/zh-CN.ts`,
            `${absPagesPath}/temp/locale/zh-CN.ts`,
          ],
          momentLocale: 'zh-cn',
        },
      ]);

      expect(exactLocalePaths(list)).toEqual([
        `${absSrcPath}/locale/en-US.js`,
        `${absPagesPath}/temp/locale/en-US.js`,
        `${absSrcPath}/locale/sk.json`,
        `${absPagesPath}/temp/locale/sk.json`,
        `${absSrcPath}/locale/zh-CN.ts`,
        `${absPagesPath}/temp/locale/zh-CN.ts`,
      ]);
    });
  });
});
