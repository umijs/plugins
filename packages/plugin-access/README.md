# @umijs/plugin-access

[![codecov](https://codecov.io/gh/umijs/plugin-access/branch/master/graph/badge.svg)](https://codecov.io/gh/umijs/plugin-access) [![NPM version](https://img.shields.io/npm/v/@umijs/plugin-access.svg?style=flat)](https://npmjs.org/package/@umijs/plugin-access) [![CircleCI](https://circleci.com/gh/umijs/plugin-access/tree/master.svg?style=svg)](https://circleci.com/gh/umijs/plugin-access/tree/master) [![GitHub Actions status](https://github.com/umijs/plugin-access/workflows/Node%20CI/badge.svg)](https://github.com/umijs/plugin-access) [![NPM downloads](http://img.shields.io/npm/dm/@umijs/plugin-access.svg?style=flat)](https://npmjs.org/package/@umijs/plugin-access)

Umi plugin for access management.

## Prerequisites

Before using this plugin, you need install and enable [@umijs/plugin-initial-state](https://www.npmjs.com/package/@umijs/plugin-initial-state) and [@umijs/plugin-model](https://www.npmjs.com/package/@umijs/plugin-model).

## Install

```bash
# or yarn
$ npm install @umijs/plugin-access --save
```

## Usage

Getting started in 3 steps.

### 1. Configure in `.umirc.js`

**Caution**: `@umijs/plugin-access`, `@umijs/plugin-initial-state` and `@umijs/plugin-model` must be in this order.

```js
export default {
  plugins: [
    ['@umijs/plugin-access'],
    ['@umijs/plugin-initial-state'],
    ['@umijs/plugin-model'],
  ],
};
```

### 2. Export `getInitialState()` function in `src/app.js`

You can fetch some data asynchronously or synchronously then return whatever value in the `getInitialState()` function, the returned value would be saved as initial state (basic information) by umi. For example:

```js
// src/app.js

export async function getInitialState() {
  const { userId, fole } = await getCurrentRole();
  return {
    userId,
    role,
  };
}
```

### 3. Create `src/access.js` and defaultly export a function to define the access feature of your application

With the initial state (basic information) prepared, you can define the access feature of your application, like "can create something", "can't update something", just return the definition in the function:

```js
// src/access.js

export default function(initialState) {
  const { userId, role } = initialState; // the initialState is the returned value in step 2

  return {
    canReadFoo: true,
    canUpdateFoo: role === 'admin',
    canDeleteFoo: foo => {
      return foo.ownerId === userId;
    },
  };
}
```

### 4. Consume the access feature definition

After step 3, now you get the access feature definition of your application, then you can use the definition in your component:

```jsx
import React from 'react';
import { useAccess, Access } from 'umi';

const PageA = props => {
  const { foo } = props;
  const access = useAccess(); // members of access: canReadFoo, canUpdateFoo, canDeleteFoo

  if (access.canReadFoo) {
    // Do something...
  }

  return (
    <div>
      <Access
        accessible={access.canReadFoo}
        fallback={<div>Can not read foo content.</div>}
      >
        Foo content.
      </Access>
      <Access
        accessible={access.canUpdateFoo}
        fallback={<div>Can not update foo.</div>}
      >
        Update foo.
      </Access>
      <Access
        accessible={access.canDeleteFoo(foo)}
        fallback={<div>Can not delete foo.</div>}
      >
        Delete foo.
      </Access>
    </div>
  );
};
```

You can use the `access` instance to control the execution flow, use `<Access>` component to control the rendering, when `accessible` is true, children is rendered, otherwise `fallback` is rendered.

**Full example can find in [./example](https://github.com/umijs/plugins/tree/master/example).**

## Options

- `options.showWarning`

A boolean value, default to be `true`. When `showWarning` is `true`, this plugin would check if `src/access.js` is exist and defaultly exports a function, if no function exported, a warning info would be shown, otherwise if `showWarning` is `false`, no warning info would be shown.

## LICENSE

MIT
