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

Configuration:

```jsx
{
  locale: {
    default?: string;
    baseNavigator?: boolean;
    useLocalStorage?: boolean;
    /** title 开启国际化 */
    title?: boolean;
    antd?: boolean;
    baseSeparator?: string;
  }
}
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
- extraLocales Corresponding `momentLocale` and `antd` configuration

```tsx
import zhTW from 'antd/es/locale/zh_TW';

// Adding new languages dynamically
addLocale(
  // name
  'zh-TW',
  // message
  {
    // id 列表
    name: '妳好，{name}',
  },
  // extraLocales
  {
    momentLocale: 'zh-tw',
    antd: zhTW,
  },
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

## Extension antd internationalization

Such as a component library based on antd ant-c, can be extended antd internationalization by the following way:

```jsx
// pluginA.js
export default api => {
  api.register({
    key: 'addAntdLocales',
    fn: args => {
      const { ssr } = api.config;
      return [
        `ant-c/${ssr ? 'lib' : 'es'}/locale/${args.lang}_${(
          args.country || args.lang
        ).toLocaleUpperCase()}`,
      ];
    },
  });
};
```

After enabling `locale: { antd: true }`, antd's [ConfigProvider](https://ant.design/components/config-provider/) will be the `antd` and `ant-c` internationalization。

## FAQ

### Why no use formatMessage?

Although formatMessage is very convenient to use, it is out of the react life cycle. The most serious problem is that it cannot trigger dom re-rendering when switching languages. In order to solve this problem, we will refresh the browser when switching languages. The user experience is poor, so it is recommended that you use [`useIntl`](./#useIntl) or [`injectIntl`](https://github.com/formatjs/react-intl/blob/master/docs/API.md#injectintl-hoc), can achieve the same thing.
