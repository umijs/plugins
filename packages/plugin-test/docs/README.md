# @umijs/plugin-test

## 启用方式

默认开启。

## 介绍

基于 jest 提供 `umi test` 命令。

包含以下特性，

- 支持 lerna 包，可以针对子包测试和生成覆盖率
- 支持 TypeScript
- 内置以下补丁
  - core-js/stable
  - regenerator-runtime/runtime
  - whatwg-fetch
- 支持通过 jest.config.json 和 package.json 中的 jest 属性进行配置，前者优先级更高
- jest.config.json 中的配置项支持函数的形式

## 使用

```bash
$ umi-test

# watch mode
$ umi-test -w
$ umi-test --watch

# collect coverage
$ umi-test --coverage

# print debug info
$ umi-test --debug

# test specified package for lerna package
$ umi-test --package name

# don't do e2e test
$ umi-test --no-e2e
```

## 配置

通过 jest.config.js 实现配置的目的，比如：

```js
module.exports = {
  moduleNameMapper: {
    '^umi$': require.resolve('umi'),
  },
};
```

但有时你会希望保留 umi-test 内置的配置，只做扩展，我们也函数的形式，比如：

```js
module.exports = {
  moduleNameMapper(memo) {
    return {
      ...memo,
      '^umi$': require.resolve('umi'),
    };
  },
};
```
