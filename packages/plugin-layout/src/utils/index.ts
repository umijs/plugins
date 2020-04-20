import pathToRegexp from 'path-to-regexp';

export const getMatchPath = (
  flatMenuKeys: string[] = [],
  path: string,
): string | undefined =>
  flatMenuKeys
    .filter(item => item && pathToRegexp(`${item}`).test(path))
    .sort((a, b) => {
      // 如果完全匹配放到最后面
      if (a === path) {
        return 10;
      }
      if (b === path) {
        return -10;
      }
      return a.substr(1).split('/').length - b.substr(1).split('/').length;
    })
    .pop();
