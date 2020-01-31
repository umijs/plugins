# @umijs/plugin-locale

## Use

installation

```bash
npm i @umijs/plugin-locale --save
```

Configure in `umirc.js`, or `config/config.js|ts`

```tsx
plugins: ['@umijs/plugin-locale'];
```

```tsx
import React, { useState } from 'react';
import { useIntl, getLocale, addLocale, getAllLocales, setLocale } from 'umi';
import styles from './index.css';

export default function() {
  const intl = useIntl();
  const [list, setList] = useState<string[]>(getAllLocales());
  const locale = getLocale();

  useEffect(() => {
    // Dynamically add new languages
    addLocale('zh-TW', {
      name: '妳好，{name}',
    });
    // refresh the list
    setList(getAllLocales());
  }, []);

  return (
    <div className={styles.normal}>
      <h1>Current language:{locale}</h1>
      {list.map(locale => (
        <a
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
            name: 'Traveler',
          },
        )}
      </button>
    </div>
  );
}
```

## API

`@umijs/plugin-locale` is based on react-intl package and supports all its APIs. For details, see [here](https://github.com/formatjs/react-intl/blob/master/docs/API.md)。For the convenience of use, we have also added some other functions. Here we will list all the APIs and show their functions.

### addLocale

Add languages dynamically. After adding languages, you can get the list by `getAllLocales`. `addLocale` three parameters.

- name The key of the language. E.g zh-TW
- message A list of ids for the language. E.g:{ // id 列表 name: '妳好，{name}', }
- momentLocale Corresponding moment configuration

```tsx
// Adding new languages dynamically
addLocale(
  // name
  'zh-TW',
  // message
  {
    // id 列表
    name: '妳好，{name}',
  },
  // momentLocale
  '',
);
```

### getAllLocales

Get the current list of all internationalization files. By default, it looks for `en-US.(js|json|ts)` files in the locales folder.

```tsx
import { getAllLocales } from 'umi';

console.log(getAllLocales()); // [en-US,zh-CN,...]
```

### getLocale

`getLocale` will get the currently selected language.

```tsx
import { getLocale } from 'umi';

console.log(getLocale()); // en-US | zh-CN
```

### useIntl

useIntl is the most commonly used API, and it can obtain APIs such as formatMessage for specific value binding.

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

Set the switching language. The page will be refreshed by default. You can dynamically switch by setting the second parameter to false.

```tsx
import { setLocale } from 'umi';

// 刷新页面
setLocale('zh-TW', true);

// 不刷新页面
setLocale('zh-TW', false);
```

## FAQ

### 为什么不要使用 formatMessage 这个语法糖？

虽然 formatMessage 使用起来会非常方便，但是它脱离了 react 的生命周期，最严重的问题就是切换语言时无法触发 dom 重新渲染。为了解决这个问题，我们切换语言时会刷新一下浏览器，用户体验很差，所以推荐大家使用 [`useIntl`](./#useIntl) 或者 [`injectIntl`](https://github.com/formatjs/react-intl/blob/master/docs/API.md#injectintl-hoc)，可以实现同样的功能
