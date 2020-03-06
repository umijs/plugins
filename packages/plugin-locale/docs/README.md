[English](README.en-US.md)

# @umijs/plugin-locale

## Use

安装

```bash
npm i @umijs/plugin-locale --save
```

在 umirc.js，或 config/config.js 中配置

```tsx
plugins: ['@umijs/plugin-locale'];
```

```tsx
import React, { useState, useEffect } from 'react';
import { useIntl, getLocale, addLocale, getAllLocales, setLocale } from 'umi';
import styles from './index.css';

export default function() {
  const intl = useIntl();
  const [list, setList] = useState<string[]>(getAllLocales());
  const locale = getLocale();

  useEffect(() => {
    // 动态增加新语言
    addLocale('zh-TW', {
      name: '妳好，{name}',
    });
    // 刷新列表
    setList(getAllLocales());
  }, []);

  return (
    <div className={styles.normal}>
      <h1>当前语言：{locale}</h1>
      {list.map(locale => (
        <a
          key={locale}
          onClick={() => {
            setLocale(locale);
          }}
          style={{
            margin: 8,
          }}
        >
          {locale}
        </a>
      ))}
      <button type="primary">
        {intl.formatMessage(
          {
            id: 'name',
          },
          {
            name: '旅行者',
          },
        )}
      </button>
    </div>
  );
}
```

## API

@umijs/plugin-locale 基于 react-intl 封装，支持其所有的 api，详情可以看[这里](https://github.com/formatjs/react-intl/blob/master/docs/API.md)。为了方便使用我们也添加了一些其他的功能，这里将会列举所有的 api，并且展示它的功能。

### addLocale

动态的增加语言，增加语言之后可以通过 getAllLocales 获得列表。addLocale 三个参数。

- name 语言的 key。例如 zh-TW
- message 语言的 id 列表。 例如：{ // id 列表 name: '妳好，{name}', }
- extraLocales 相应的 `momentLocale` 和 `antd` 配置

```tsx
import zhTW from 'antd/es/locale/zh_TW';

// 动态增加新语言
addLocale(
  'zh-TW',
  {
    // id 列表
    name: '妳好，{name}',
  },
  {
    momentLocale: 'zh-tw',
    antd: zhTW,
  },
);
```

### getAllLocales

获取当前获得所有国际化文件的列表，默认会在 locales 文件夹下寻找类似 en-US.(js|json|ts) 文件。

```tsx
import { getAllLocales } from 'umi';

console.log(getAllLocales()); // [en-US,zh-CN,...]
```

### getLocale

`getLocale` 将获得当前选择的语言。

```tsx
import { getLocale } from 'umi';

console.log(getLocale()); // en-US | zh-CN
```

### useIntl

useIntl 是最常用的 api,它可以获得 formatMessage 等 api 来进行具体的值绑定。

```ts
// en-US.json
export default {
  name: 'Hi, {name}',
};
```

```tsx
//page/index.tsx

import React, { useState } from 'react';
import { useIntl } from 'umi';

export default function() {
  const intl = useIntl();
  return (
    <button type="primary">
      {intl.formatMessage(
        {
          id: 'name',
          defaultMessage: '你好，旅行者',
        },
        {
          name: '旅行者',
        },
      )}
    </button>
  );
}
```

### setLocale

设置切换语言，默认会刷新页面，可以通过设置第二个参数为 false，来动态切换。

```tsx
import { setLocale } from 'umi';

// 刷新页面
setLocale('zh-TW', true);

// 不刷新页面
setLocale('zh-TW', false);
```

### 运行时配置

支持运行时对国际化做一些扩展与定制，例如自定义语言识别等。

#### getLocale

自定义语言获取逻辑，比如识别链接 `?locale=${lang}` 当做当前页面的语言。

```js
// src/app.js
import qs from 'qs';

export const locale = {
  getLocale() {
    const { search } = window.location;
    const { locale = 'zh-CN' } = qs.parse(search, { ignoreQueryPrefix: true });
    return locale;
  },
};
```

#### setLocale

自定义语言切换逻辑。其中有三个参数：

- lang: 需要切换的语言
- realReload: 是否需要刷新页面，这个是由页面调用 `setLocale(lang, true)` 透传。
- updater：是否触发组件 rerender 重渲染。

```js
// src/app.js
export const locale = {
  setLocale({ lang, realReload, updater }) {
    history.push(`/?locale=${lang}`);
    updater();
  },
};
```

## FAQ

### 为什么不要使用 formatMessage 这个语法糖？

虽然 formatMessage 使用起来会非常方便，但是它脱离了 react 的生命周期，最严重的问题就是切换语言时无法触发 dom 重新渲染。为了解决这个问题，我们切换语言时会刷新一下浏览器，用户体验很差，所以推荐大家使用 [`useIntl`](https://github.com/formatjs/react-intl/blob/master/docs/API.md#useintl-hook) 或者 [`injectIntl`](https://github.com/formatjs/react-intl/blob/master/docs/API.md#injectintl-hoc)，可以实现同样的功能。
