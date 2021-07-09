# @umijs/plugin-lodash

> [babel-plugin-import](https://github.com/ant-design/babel-plugin-import) for umijs plugin

```js
import _ from "lodash"
const obj = { a: 1 }
_.get(obj, 'a')

↓ ↓ ↓ ↓ ↓ ↓

var _get = require('lodash/get');
var obj = { a: 1}
_get(obj, 'a')
```

See our website [@umijs/plugin-lodash](https://umijs.org/plugins/plugin-lodash) for more information.

## Install

Using npm:

```bash
$ npm install --save-dev @umijs/plugin-lodash
```

or using yarn:

```bash
$ yarn add @umijs/plugin-lodash --dev
```
