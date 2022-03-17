// ref:
// - https://umijs.org/plugins/api
import { join } from 'path';
import { IApi } from '@umijs/types';
import TranslateMain from './main';

export default function(api: IApi) {
  const { absNodeModulesPath, absTmpPath, cwd, absSrcPath } = api.paths;
  api.describe({
    key: 'translate',
    config: {
      default: {
        /** 翻译文件的后缀名，一般在使用umi创建项目时，是有js或者ts两种方式的*/
        suffix: 'ts',
        /** 输出翻译文件的对应表，一个对象代表一个语言
         * type：翻译对应的语言（谷歌翻译对应的语言标识）
         * fileName代表umi对应的语言文件夹和文件名（文件名和文件夹是一致的）
         * */
        translateTypes: [{ type: 'en', fileName: 'en-US' }, { type: 'ja', fileName: 'ja-JP' }],
        /**  输入的翻译类型（以哪种语言作为翻译的源），默认是中文
         * type：翻译对应的语言（谷歌翻译对应的语言标识）
         * fileName代表umi对应的语言文件夹和文件名（文件名和文件夹是一致的）
         * */
        from: { type: 'zh-CN', fileName: 'zh-CN' },
        /** 默认国际化文件的路径*/
        path: 'src/locales',
      },
      schema(joi: any) {
        const itemSchema = joi.object({
          suffix: joi.string(),
          translateTypes: joi.array().items(joi.object({
            type: joi.string(), fileName: joi.string(),
          })),
          from: joi.object({
            type: joi.string(), fileName: joi.string(),
          }),
          path: joi.string(),
        });
        return itemSchema;
      },
    },
    enableBy: api.EnableBy.config,
  });
  api.registerCommand({
    name: 'translate',
    alias: 'tr',
    fn: async ({ args }) => {
      translateFile();
      return `hello ${api.args.projectName}`;
    },
  });

  /** 根据配置文件进行翻译 */
  function translateFile() {
    let translate = new TranslateMain({ ...api.config.translate,cwd });
    translate.translateCallback = (type, filename) => {
      api.logger.log(`翻译：${filename}文件---`, type, '完成');
    };
    translate.run();
  }
}
