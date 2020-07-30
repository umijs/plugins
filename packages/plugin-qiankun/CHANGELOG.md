# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.6.0](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.5.1...@umijs/plugin-qiankun@2.6.0) (2020-07-30)


### Features

* **qiankun:** support to pass container for different sub apps ([#310](https://github.com/umijs/plugins/issues/310)) ([ff9a499](https://github.com/umijs/plugins/commit/ff9a4991f1be50d3a4aa89cd25f956386d4e1662))
* **qiankun:** 支持运行时动态设置 clientRender 的 rootElement ([#312](https://github.com/umijs/plugins/issues/312)) ([e90e0ca](https://github.com/umijs/plugins/commit/e90e0ca1b1178675e985389eae2623ebee4aa53d))





## [2.5.1](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.5.0...@umijs/plugin-qiankun@2.5.1) (2020-07-08)


### Bug Fixes

* **qiankun:** concat not defined in MicroApp ([#298](https://github.com/umijs/plugins/issues/298)) ([2b65bf7](https://github.com/umijs/plugins/commit/2b65bf7d5af90565b4a77b17fb20602312129dfb))





# [2.5.0](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.4.1...@umijs/plugin-qiankun@2.5.0) (2020-07-08)


### Features

* **qiankun:** microApp auto setLoading ([#293](https://github.com/umijs/plugins/issues/293)) ([18c15f2](https://github.com/umijs/plugins/commit/18c15f2f041b7abffa826f665d6f88d9289479c8))
* **qiankun:** MicroApp support lifeCycles ([#296](https://github.com/umijs/plugins/issues/296)) ([def736b](https://github.com/umijs/plugins/commit/def736b5830e7e41bdd4c24319e4c0c659aa751d))





## [2.4.1](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.4.0...@umijs/plugin-qiankun@2.4.1) (2020-07-04)


### Bug Fixes

* **qiankun:** 修复 mounting 期间更新操作丢失 & 短时间内连续更新会抛状态异常的问题 ([#289](https://github.com/umijs/plugins/issues/289)) ([2456e40](https://github.com/umijs/plugins/commit/2456e409e59baa2a04f3638b27f6448363892e51))





# [2.4.0](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.3.2...@umijs/plugin-qiankun@2.4.0) (2020-07-01)

### Features

- **qiankun:** slave 默认启用 runtimeHistory ([#284](https://github.com/umijs/plugins/issues/284)) ([c5e84a5](https://github.com/umijs/plugins/commit/c5e84a51de01b6d6b242a60e90743570a2b56b29))
- **qiankun:** 添加 shouldNotModifyDefaultBase slave 配置用于关闭默认修改行为 ([#279](https://github.com/umijs/plugins/issues/279)) ([6b37163](https://github.com/umijs/plugins/commit/6b3716330ec3c8471c4c7a6f9677664ed42612eb))

## [2.3.2](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.3.1...@umijs/plugin-qiankun@2.3.2) (2020-06-29)

### Bug Fixes

- **qiankun:** 支持异步启动 qiankun slave ([#275](https://github.com/umijs/plugins/issues/275)) ([ded2d0e](https://github.com/umijs/plugins/commit/ded2d0e1c4a9d066084dca317a9029df181bbb2d))

## [2.3.1](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.3.0...@umijs/plugin-qiankun@2.3.1) (2020-06-28)

### Bug Fixes

- **qiankun:** 修复 babel parse ts 文件出错的问题 ([#271](https://github.com/umijs/plugins/issues/271)) ([9cd07cd](https://github.com/umijs/plugins/commit/9cd07cd88e9f822668271f7d772ac350b09b9633))

# [2.3.0](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.2.0...@umijs/plugin-qiankun@2.3.0) (2020-06-28)

### Features

- **qiankun:** 支持 qiankun2.0 特性 ([#148](https://github.com/umijs/plugins/issues/148)) ([0297840](https://github.com/umijs/plugins/commit/029784013bbddd2cf552d68dcb8307c861c50b75)), closes [#178](https://github.com/umijs/plugins/issues/178) [#179](https://github.com/umijs/plugins/issues/179) [#214](https://github.com/umijs/plugins/issues/214) [#267](https://github.com/umijs/plugins/issues/267)

# [2.2.0](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.1.1...@umijs/plugin-qiankun@2.2.0) (2020-05-21)

### Features

- **qiankun:** 兼容 ssr ([#223](https://github.com/umijs/plugins/issues/223)) ([82ec2df](https://github.com/umijs/plugins/commit/82ec2df4c835c0fd4ce6895223a11cd0bfbc6026))

## [2.1.1](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.1.0...@umijs/plugin-qiankun@2.1.1) (2020-04-11)

### Bug Fixes

- **qiankun:** 修复 qiankun 插件生成 mock 时 React undefined 的问题 ([#147](https://github.com/umijs/plugins/issues/147)) ([5669d2f](https://github.com/umijs/plugins/commit/5669d2fd9d79babb1e4dc1e32af7f0b3f4cd94bc))

# [2.1.0](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.0.7...@umijs/plugin-qiankun@2.1.0) (2020-04-07)

### Features

- **qiankun:** merge 1.x features to 2.x ([#138](https://github.com/umijs/plugins/issues/138)) ([ffac76d](https://github.com/umijs/plugins/commit/ffac76d5f2afec8b7203ea2e9c8a49fcf31c092f))

## [2.0.7](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.0.6...@umijs/plugin-qiankun@2.0.7) (2020-04-07)

### Bug Fixes

- qiankun support other configs ([e3dde80](https://github.com/umijs/plugins/commit/e3dde80db4983f3bbc358a11edc1084a97842082))

## [2.0.6](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.0.5...@umijs/plugin-qiankun@2.0.6) (2020-03-12)

### Bug Fixes

- qiankun import path for fix build error ([#82](https://github.com/umijs/plugins/issues/82)) ([31c5733](https://github.com/umijs/plugins/commit/31c573382841d52a1246162a5898b3e23364d174))

## [2.0.5](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.0.4...@umijs/plugin-qiankun@2.0.5) (2020-03-04)

**Note:** Version bump only for package @umijs/plugin-qiankun

## [2.0.4](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.0.3...@umijs/plugin-qiankun@2.0.4) (2020-02-29)

**Note:** Version bump only for package @umijs/plugin-qiankun

## [2.0.3](https://github.com/umijs/umi-plugin-qiankun/compare/@umijs/plugin-qiankun@2.0.2...@umijs/plugin-qiankun@2.0.3) (2020-02-26)

**Note:** Version bump only for package @umijs/plugin-qiankun

## [2.0.2](https://github.com/umijs/umi-plugin-qiankun/compare/@umijs/plugin-qiankun@2.0.1...@umijs/plugin-qiankun@2.0.2) (2020-02-22)

### Bug Fixes

- bug when history is undefined ([#45](https://github.com/umijs/umi-plugin-qiankun/issues/45)) ([50d4213](https://github.com/umijs/umi-plugin-qiankun/commit/50d4213f1c6d5878751c151b7eae3650a6083867))

## [2.0.1](https://github.com/umijs/umi-plugin-qiankun/compare/@umijs/plugin-qiankun@2.0.0...@umijs/plugin-qiankun@2.0.1) (2020-02-21)

**Note:** Version bump only for package @umijs/plugin-qiankun

# [2.0.0](https://github.com/umijs/umi-plugin-qiankun/compare/@umijs/plugin-qiankun@2.0.0-alpha.1...@umijs/plugin-qiankun@2.0.0) (2020-02-19)

### Bug Fixes

- **plugin-qiankun:** chainWebpack not return ([64a8cdd](https://github.com/umijs/umi-plugin-qiankun/commit/64a8cdd58735c97cba46286f72243ae0bfc0c87e))

# 2.0.0-alpha.1 (2020-02-18)

### Features

- micro frontent qiankun plugin ([#32](https://github.com/umijs/umi-plugin-qiankun/issues/32)) ([841752c](https://github.com/umijs/umi-plugin-qiankun/commit/841752ceca07b84f8b984b54b366ad3ede614be7))
