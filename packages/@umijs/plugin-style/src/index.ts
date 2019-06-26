import { IApi } from 'umi-types';

export type StyleConfig = Array<string>;

export default function(api: IApi, option: StyleConfig) {
  const isUrl = (url: string) => /^(http:|https:)?\/\//.test(url);
  api.onOptionChange(newOption => {
    option = newOption;
    api.rebuildHTML();
    api.refreshBrowser();
  });

  api.addHTMLStyle(() => {
    return option
      .filter((opt: string) => !isUrl(opt))
      .map((aStyle: string) => ({
        content: aStyle,
      }));
  });
  api.addHTMLLink(() => {
    return option
      .filter((opt: string) => isUrl(opt))
      .map((aLink: string) => ({
        rel: 'stylesheet',
        href: aLink,
      }));
  });
}
