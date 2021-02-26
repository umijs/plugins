import { Service } from 'umi';
import { join } from 'path';
import { getLocaleList, exactLocalePaths } from './utils';

describe('utils', () => {
  describe('getLocaleList', () => {
    it('base-separator', async () => {
      const service = new Service({
        cwd: join(__dirname, '../fixtures/base-separator'),
        plugins: [require.resolve('./')],
      });
      await service.init();
      const { absSrcPath, absPagesPath } = service.paths;
      const opts = {
        localeFolder: service.config?.singular ? 'locale' : 'locales',
        separator: service.config?.locale?.baseSeparator,
        absSrcPath,
        absPagesPath,
        addAntdLocales: async (args) => [
          `antd/lib/locale/${args.lang}_${(
            args.country || args.lang
          ).toLocaleUpperCase()}`,
        ],
      };
      const list = await getLocaleList(opts);
      expect(list).toEqual([
        {
          lang: 'en',
          country: 'US',
          name: 'en_US',
          antdLocale: ['antd/lib/locale/en_US'],
          locale: 'en-US',
          paths: [
            `${absSrcPath}/locales/en_US.js`,
            `${absPagesPath}/temp/locales/en_US.js`,
          ],
          momentLocale: '',
        },
        {
          lang: 'sk',
          country: '',
          name: 'sk',
          locale: 'sk',
          paths: [
            `${absSrcPath}/locales/sk.js`,
            `${absPagesPath}/temp/locales/sk.js`,
          ],
          antdLocale: ['antd/lib/locale/sk_SK'],
          momentLocale: 'sk',
        },
        {
          lang: 'zh',
          country: 'CN',
          name: 'zh_CN',
          locale: 'zh-CN',
          paths: [
            `${absSrcPath}/locales/zh_CN.js`,
            `${absPagesPath}/temp/locales/zh_CN.js`,
          ],
          momentLocale: 'zh-cn',
          antdLocale: ['antd/lib/locale/zh_CN'],
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
        // plugins: [require.resolve('./')],
      });
      await service.init();
      const { absSrcPath, absPagesPath } = service.paths;
      const opts = {
        localeFolder: service.config?.singular ? 'locale' : 'locales',
        separator: service.config?.locale?.baseSeparator,
        absSrcPath,
        absPagesPath,
        addAntdLocales: async (args) => [
          `antd/lib/locale/${args.lang}_${(
            args.country || args.lang
          ).toLocaleUpperCase()}`,
        ],
      };
      const list = await getLocaleList(opts);
      expect(list).toEqual([
        {
          lang: 'en',
          country: 'US',
          name: 'en-US',
          antdLocale: ['antd/lib/locale/en_US'],
          locale: 'en-US',
          paths: [
            `${absSrcPath}/locale/en-US.js`,
            `${absPagesPath}/temp/locale/en-US.js`,
          ],
          momentLocale: '',
        },
        {
          lang: 'sk',
          country: '',
          name: 'sk',
          locale: 'sk',
          paths: [
            `${absSrcPath}/locale/sk.json`,
            `${absPagesPath}/temp/locale/sk.json`,
          ],
          antdLocale: ['antd/lib/locale/sk_SK'],
          momentLocale: 'sk',
        },
        {
          lang: 'zh',
          country: 'CN',
          name: 'zh-CN',
          locale: 'zh-CN',
          paths: [
            `${absSrcPath}/locale/zh-CN.ts`,
            `${absPagesPath}/temp/locale/zh-CN.ts`,
          ],
          antdLocale: ['antd/lib/locale/zh_CN'],
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
