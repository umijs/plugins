English | [中文文档](./README_CN.md)

# @umijs/plugin-initial-state

[![codecov](https://codecov.io/gh/umijs/plugin-initial-state/branch/master/graph/badge.svg)](https://codecov.io/gh/umijs/plugin-initial-state) [![NPM version](https://img.shields.io/npm/v/@umijs/plugin-initial-state.svg?style=flat)](https://npmjs.org/package/@umijs/plugin-initial-state) [![CircleCI](https://circleci.com/gh/umijs/plugin-initial-state/tree/master.svg?style=svg)](https://circleci.com/gh/umijs/plugin-initial-state/tree/master) [![GitHub Actions status](https://github.com/umijs/plugin-initial-state/workflows/Node%20CI/badge.svg)](https://github.com/umijs/plugin-initial-state) [![NPM downloads](http://img.shields.io/npm/dm/@umijs/plugin-initial-state.svg?style=flat)](https://npmjs.org/package/@umijs/plugin-initial-state)

Umi plugin to store initial state globally.

## Install

```bash
# or yarn
$ npm install @umijs/plugin-initial-state --save
```

## Usage

Getting started in 3 steps.

### 1. Configure in `.umirc.js`

```js
export default {
  plugins: [['@umijs/plugin-initial-state', options]],
};
```

### 2. Add getInitialState into `src/app.ts`

```js
export async function getInitialState() {
  return 'Hello World';
}
```

### 3. Use it in your React Component or other models

```js
import React from 'react';
import { useModel } from 'umi';

export default () => {
  const { initialState, loading, refresh } = useModel('@@initialState');
  return <>{loading ? 'loading...' : initialState}</>;
};
```

Full example can find in [./example](https://github.com/umijs/plugin-initial-state/tree/master/example).

## LICENSE

MIT
