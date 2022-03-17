# translate

[![NPM version](https://img.shields.io/npm/v/translate.svg?style=flat)](https://npmjs.org/package/translate)
[![NPM downloads](http://img.shields.io/npm/dm/translate.svg?style=flat)](https://npmjs.org/package/translate)

translate

## 安装

```bash
$ npm install @umijs/plugin-translate
# or yarn add @umijs/plugin-translate
```

## 使用

```bash
$ umi translate or umi tr
```



## 准备工作

此为适配umi的插件，国际化规则参照antd，或者antd-pro

![image-20220314103226027](E:\ztao\translate\images\image-20220314103226027.png)



## 配置

在 umi中的 `config/config.js`,

```ts
const translate={
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
}
```

- `suffix` 翻译文件的后缀名，一般在使用umi创建项目时，是有js或者ts两种方式的

- `translateTypes` 输出翻译文件的对应表，一个对象代表一个语言

- `from` 输入的翻译类型（以哪种语言作为翻译的源），默认是中文

- `path` 默认国际化文件的路径（默认以antd-pro的位置src/locales）



## LICENSE

MIT
