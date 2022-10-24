# Change Log

All notable changes to this project will be documented in this file. See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.41.0](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.40.0...@umijs/plugin-qiankun@2.41.0) (2022-10-24)

### Features

- prefetch 增加 threshold 配置，避免低端机场景 prefetch 造成的 oom ([#909](https://github.com/umijs/plugins/issues/909)) ([8d00657](https://github.com/umijs/plugins/commit/8d0065702230a1fec3b74453907901bc88c4aaf3))

# [2.40.0](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.39.2...@umijs/plugin-qiankun@2.40.0) (2022-08-22)

### Bug Fixes

- **plugin-qiankun:** deps reoslve error when using pnpm ([#869](https://github.com/umijs/plugins/issues/869)) ([193a3d6](https://github.com/umijs/plugins/commit/193a3d66c9f70727d60bcac69565a4221d7010ef))

### Features

- **plugin-qiankun:** 支持 qiankun 主应用本地研发 ([#891](https://github.com/umijs/plugins/issues/891)) ([cd366e6](https://github.com/umijs/plugins/commit/cd366e6d756b1aa5ba91d39211bac578d0897694))

## [2.39.2](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.39.1...@umijs/plugin-qiankun@2.39.2) (2022-06-08)

### Bug Fixes

- **qiankun:** 兼容已经使用 alias 作为 props 使用的场景 ([#866](https://github.com/umijs/plugins/issues/866)) ([7e4f46f](https://github.com/umijs/plugins/commit/7e4f46f5994ba7abf6f71dc20b3a768e67d27219))

## [2.39.1](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.39.0...@umijs/plugin-qiankun@2.39.1) (2022-06-08)

**Note:** Version bump only for package @umijs/plugin-qiankun

# [2.39.0](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.38.0...@umijs/plugin-qiankun@2.39.0) (2022-06-07)

### Features

- 支持为 MicroApp 配置 name 键的别名 ([#863](https://github.com/umijs/plugins/issues/863)) ([b7dbe19](https://github.com/umijs/plugins/commit/b7dbe193bde8058bfd805c50032abb50c458939c))

# [2.38.0](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.37.2...@umijs/plugin-qiankun@2.38.0) (2022-06-07)

### Features

- **qiankun:** 检查是否因为用户本地的配置的 app ，导致 app 冲突 ([#839](https://github.com/umijs/plugins/issues/839)) ([b3a05ee](https://github.com/umijs/plugins/commit/b3a05ee8be65804443a8cf70cbca782dc5d60cfd))

## [2.37.2](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.37.1...@umijs/plugin-qiankun@2.37.2) (2022-04-01)

### Bug Fixes

- **plugin-qiankun:** 修复重定向问题 ([#822](https://github.com/umijs/plugins/issues/822)) ([78a04d6](https://github.com/umijs/plugins/commit/78a04d64e3ee408c1ea4f2782d2c366442fefd61))

## [2.37.1](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.37.0...@umijs/plugin-qiankun@2.37.1) (2022-03-24)

### Bug Fixes

- **qiankun:** 修复合并路由丢失的问题 ([#819](https://github.com/umijs/plugins/issues/819)) ([dad0e9a](https://github.com/umijs/plugins/commit/dad0e9ad8f465c7c82bf9f8bb1d763ec7faa2612))

# [2.37.0](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.36.0...@umijs/plugin-qiankun@2.37.0) (2022-03-18)

### Features

- **plugin-qiankun:** 一行配置即可本地研发子应用时能够看到主子应用嵌套场面 ([#813](https://github.com/umijs/plugins/issues/813)) ([837b06b](https://github.com/umijs/plugins/commit/837b06b92b19d5b950022ec60ec0129983fb50e5))

# [2.36.0](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.35.5...@umijs/plugin-qiankun@2.36.0) (2022-02-15)

### Bug Fixes

- **qiankun:** 修复类型问题 ([#799](https://github.com/umijs/plugins/issues/799)) ([e81f1db](https://github.com/umijs/plugins/commit/e81f1dbba7062e76304a0224a0bef6ac0a62ffa4))

### Features

- **qiankun:** 微应用支持 insertBefore 路由([#796](https://github.com/umijs/plugins/issues/796)) ([a50cd83](https://github.com/umijs/plugins/commit/a50cd83fabefb164cdbe57ae8bbb1e9bc274f58e))

## [2.35.5](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.35.4...@umijs/plugin-qiankun@2.35.5) (2022-02-08)

**Note:** Version bump only for package @umijs/plugin-qiankun

## [2.35.4](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.35.3...@umijs/plugin-qiankun@2.35.4) (2021-12-14)

### Bug Fixes

- **qiankun:** loading 结束后需要隐藏 loading 容器 ([#765](https://github.com/umijs/plugins/issues/765)) ([76932de](https://github.com/umijs/plugins/commit/76932de41b0da9088aff6cccc8618593768aa05b))
- **qiankun:** 修复 loading class 为 undefined 的问题 ([#766](https://github.com/umijs/plugins/issues/766)) ([3093b0a](https://github.com/umijs/plugins/commit/3093b0a32b09b75629fa93ab14aedb30acf0b4aa))

## [2.35.3](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.35.2...@umijs/plugin-qiankun@2.35.3) (2021-12-14)

### Bug Fixes

- **qiankun:** add default classname and new laoding style ([#758](https://github.com/umijs/plugins/issues/758)) ([9a7f434](https://github.com/umijs/plugins/commit/9a7f4342e2d5694bcf7e8cad5b539cd91ad15d11))
- Minimize the use of the lodash module ([#643](https://github.com/umijs/plugins/issues/643)) ([928b447](https://github.com/umijs/plugins/commit/928b447581ee6e40fd433c9ba1016ef3c68b363e))

## [2.35.2](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.35.1...@umijs/plugin-qiankun@2.35.2) (2021-11-04)

### Bug Fixes

- **qiankun:** 默认 mfName 值替换掉报名里的特殊字符 ([#737](https://github.com/umijs/plugins/issues/737)) ([b291dab](https://github.com/umijs/plugins/commit/b291dabbc48585232e404d815bf68ca7ae4d708a))

## [2.35.1](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.35.0...@umijs/plugin-qiankun@2.35.1) (2021-11-01)

### Bug Fixes

- **qiankun:** 修复初始化时 error 状态变更触发了 loop rendering 的问题 ([#735](https://github.com/umijs/plugins/issues/735)) ([bbec8b7](https://github.com/umijs/plugins/commit/bbec8b7b8864b416643b1a5ef00fca18c25182a1))

# [2.35.0](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.34.1...@umijs/plugin-qiankun@2.35.0) (2021-10-26)

### Features

- 支持 mfsu 开启场景 ([#699](https://github.com/umijs/plugins/issues/699)) ([43f6485](https://github.com/umijs/plugins/commit/43f648519dc3bd67f0898e35da5d570f3d3cdbde))

## [2.34.1](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.34.0...@umijs/plugin-qiankun@2.34.1) (2021-10-15)

### Bug Fixes

- **qiankun:** 修复 prefetch 对数组配置支持不完善的问题 ([#723](https://github.com/umijs/plugins/issues/723)) ([c6abd56](https://github.com/umijs/plugins/commit/c6abd56f10551fb463ce451ac13b1795a64442e6))

# [2.34.0](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.33.1...@umijs/plugin-qiankun@2.34.0) (2021-10-11)

### Features

- **qiankun:** 支持嵌套场景 ([#714](https://github.com/umijs/plugins/issues/714)) ([ccfc854](https://github.com/umijs/plugins/commit/ccfc854edc4b3bed872fda60f681bab66940543b))

## [2.33.1](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.33.0...@umijs/plugin-qiankun@2.33.1) (2021-09-09)

### Bug Fixes

- **qiankun:** 修复 prefetch 的问题 ([#710](https://github.com/umijs/plugins/issues/710)) ([00a6be4](https://github.com/umijs/plugins/commit/00a6be44b92c34ea044d9f0bf8d08d3aafed6da8))

# [2.33.0](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.32.2...@umijs/plugin-qiankun@2.33.0) (2021-09-07)

### Features

- 支持运行时配置嵌套的路由关联微应用 ([#706](https://github.com/umijs/plugins/issues/706)) ([1e9e5db](https://github.com/umijs/plugins/commit/1e9e5db02c6a5d2aacf375e928941fa4694458ca))

## [2.32.2](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.32.1...@umijs/plugin-qiankun@2.32.2) (2021-09-06)

### Bug Fixes

- **qiankun:** 修复空值问题 ([#704](https://github.com/umijs/plugins/issues/704)) ([48ad20d](https://github.com/umijs/plugins/commit/48ad20dee6c698ab6f4363b6f6ffbb5d7ab3e9e2))

## [2.32.1](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.32.0...@umijs/plugin-qiankun@2.32.1) (2021-09-06)

**Note:** Version bump only for package @umijs/plugin-qiankun

# [2.32.0](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.31.1...@umijs/plugin-qiankun@2.32.0) (2021-09-06)

### Features

- **qiankun:** qiankun config 支持 enable 配置 ([#702](https://github.com/umijs/plugins/issues/702)) ([70feb32](https://github.com/umijs/plugins/commit/70feb32fa0e85e43dbef9b2af20333820d2a07bd))
- **qiankun:** support insert route ([#698](https://github.com/umijs/plugins/issues/698)) ([228618c](https://github.com/umijs/plugins/commit/228618c4497a89a24eb6fad139ac4a4315fe663d))

## [2.31.1](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.31.0...@umijs/plugin-qiankun@2.31.1) (2021-08-31)

### Bug Fixes

- log error in boundary component ([#693](https://github.com/umijs/plugins/issues/693)) ([0359a3f](https://github.com/umijs/plugins/commit/0359a3f2a950aa3d2fcd351830b3a26871a88dd6))

# [2.31.0](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.30.1...@umijs/plugin-qiankun@2.31.0) (2021-08-27)

### Bug Fixes

- **qiankun:** 允许 qiankun pacthRoute 时 routes 为空数组 ([#689](https://github.com/umijs/plugins/issues/689)) ([97ee607](https://github.com/umijs/plugins/commit/97ee607c29b40c072c0659ff93344189e4587a41))

### Features

- **qiankun:** slave 新增 shouldNotAddLibraryChunkName 配置 ([#692](https://github.com/umijs/plugins/issues/692)) ([3f64a2d](https://github.com/umijs/plugins/commit/3f64a2dc8e32578e7d7a3d8a8fc56e6d21338966))

## [2.30.1](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.30.0...@umijs/plugin-qiankun@2.30.1) (2021-08-23)

**Note:** Version bump only for package @umijs/plugin-qiankun

# [2.30.0](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.29.1...@umijs/plugin-qiankun@2.30.0) (2021-08-23)

### Bug Fixes

- stop loading when error occure ([#688](https://github.com/umijs/plugins/issues/688)) ([aea2c5e](https://github.com/umijs/plugins/commit/aea2c5ea5e76aba49fdb84475d13983a238c18d0))

### Features

- error boundary support locale ([#687](https://github.com/umijs/plugins/issues/687)) ([0485217](https://github.com/umijs/plugins/commit/0485217f2388cdd3c6e096ed4d1468e1d3880d6c))

## [2.29.1](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.29.0...@umijs/plugin-qiankun@2.29.1) (2021-08-19)

**Note:** Version bump only for package @umijs/plugin-qiankun

# [2.29.0](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.28.0...@umijs/plugin-qiankun@2.29.0) (2021-08-17)

### Features

- add errorBoundary and microApp forwardRef ([#678](https://github.com/umijs/plugins/issues/678)) ([0cfa952](https://github.com/umijs/plugins/commit/0cfa95259fc51d28125b4b7fc2d8466403e7e156))

# [2.28.0](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.27.0...@umijs/plugin-qiankun@2.28.0) (2021-08-12)

### Features

- qiankun errorBoundary ([#675](https://github.com/umijs/plugins/issues/675)) ([a0fde5b](https://github.com/umijs/plugins/commit/a0fde5bb41e3fadde6c8e3ec83f71697e82d73b1))

# [2.27.0](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.26.0...@umijs/plugin-qiankun@2.27.0) (2021-07-21)

### Features

- **qiankun:** 修改 dynamicRoot 时路由模式加载微应用时 base 传值 ([#642](https://github.com/umijs/plugins/issues/642)) ([2467b89](https://github.com/umijs/plugins/commit/2467b8939d58d6f4d12ef1391bd29eac172067df))

# [2.26.0](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.25.2...@umijs/plugin-qiankun@2.26.0) (2021-07-06)

### Features

- **qiankun:** 支持手动指定预加载的应用 ([#649](https://github.com/umijs/plugins/issues/649)) ([b74db01](https://github.com/umijs/plugins/commit/b74db017887cd7848bb6b0b05b44344f424d48ff))

## [2.25.2](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.25.1...@umijs/plugin-qiankun@2.25.2) (2021-06-30)

### Bug Fixes

- qiankun slave runtime should use esm format ([#645](https://github.com/umijs/plugins/issues/645)) ([5816848](https://github.com/umijs/plugins/commit/5816848b8b404e967bc9b392a73403cf1e2893d8))

## [2.25.1](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.25.0...@umijs/plugin-qiankun@2.25.1) (2021-06-23)

**Note:** Version bump only for package @umijs/plugin-qiankun

# [2.25.0](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.24.1...@umijs/plugin-qiankun@2.25.0) (2021-06-03)

### Features

- **layout:** renderRightContent support locale ([#624](https://github.com/umijs/plugins/issues/624)) ([6d3fc2d](https://github.com/umijs/plugins/commit/6d3fc2df3f75b3e700b78a9e267099c7f70be47b))

## [2.24.1](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.24.0...@umijs/plugin-qiankun@2.24.1) (2021-03-19)

### Bug Fixes

- 修复 prefetch true 行为 ([#564](https://github.com/umijs/plugins/issues/564)) ([efa1472](https://github.com/umijs/plugins/commit/efa1472d754af2b1cfed895b70606747d32b94f2))
- 修复运行时路由不支持嵌套根路由的问题 ([#565](https://github.com/umijs/plugins/issues/565)) ([5388f04](https://github.com/umijs/plugins/commit/5388f040c036537167b60adb6f1355acb56795a4))

# [2.24.0](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.23.0...@umijs/plugin-qiankun@2.24.0) (2021-03-19)

### Bug Fixes

- **qiankun:** runtime routes not loaded correctly ([#541](https://github.com/umijs/plugins/issues/541)) ([ea086ee](https://github.com/umijs/plugins/commit/ea086eef269d277d49d261e49aa865a2bd30744a))

### Features

- 增加 credentials 参数，自动携带跨域 cookie ([#560](https://github.com/umijs/plugins/issues/560)) ([f494a22](https://github.com/umijs/plugins/commit/f494a222a9e33b766f896a46833f72eb113e3044))

# [2.23.0](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.22.1...@umijs/plugin-qiankun@2.23.0) (2021-03-11)

### Features

- 支持微应用配置嵌套的子路由 ([#552](https://github.com/umijs/plugins/issues/552)) ([7a7f77b](https://github.com/umijs/plugins/commit/7a7f77b43658d23723794931d9cf6fe6bce23a8f))

## [2.22.1](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.22.0...@umijs/plugin-qiankun@2.22.1) (2021-03-04)

### Bug Fixes

- make getSlaveRuntime function asynchronous ([#548](https://github.com/umijs/plugins/issues/548)) ([6cee8e6](https://github.com/umijs/plugins/commit/6cee8e6c44e5f291941bf643c1cd69c27aae739f))
- **qiankun:** lodash bundled all ([#534](https://github.com/umijs/plugins/issues/534)) ([ebb7a68](https://github.com/umijs/plugins/commit/ebb7a68fdc72d1d27ae26eb75ccb12fb4439daa0))

# [2.22.0](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.21.2...@umijs/plugin-qiankun@2.22.0) (2021-02-09)

### Features

- 增加 devSourceMap 配置用于关闭开发阶段 sourcemap 插件 ([#536](https://github.com/umijs/plugins/issues/536)) ([1441b19](https://github.com/umijs/plugins/commit/1441b1997ffbf66b3d7d9c172348583783d5f4df))

## [2.21.2](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.21.1...@umijs/plugin-qiankun@2.21.2) (2021-01-21)

### Bug Fixes

- 移除 webpack 构建时无效引用 warning ([#518](https://github.com/umijs/plugins/issues/518)) ([329d3f1](https://github.com/umijs/plugins/commit/329d3f1df651fdaff3b90b4653213846141f5a2a))

## [2.21.1](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.21.0...@umijs/plugin-qiankun@2.21.1) (2021-01-21)

### Bug Fixes

- 修复启动阶段的 warning ([#517](https://github.com/umijs/plugins/issues/517)) ([97f3ee4](https://github.com/umijs/plugins/commit/97f3ee47d33df73f45d58d0b384942960a261f2c))

# [2.21.0](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.20.0...@umijs/plugin-qiankun@2.21.0) (2021-01-19)

### Features

- **qiankun:** 移除主应用对 mountElementId 的变更 ([#515](https://github.com/umijs/plugins/issues/515)) ([d5e140c](https://github.com/umijs/plugins/commit/d5e140c754ac92f0a6ed2ae24d5fe08aaafedffc))

# [2.20.0](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.19.0...@umijs/plugin-qiankun@2.20.0) (2021-01-14)

### Features

- **qiankun:** 移除子应用对 mountElementId 的变更 ([#481](https://github.com/umijs/plugins/issues/481)) ([f37d07b](https://github.com/umijs/plugins/commit/f37d07b53b50ec57c8300964aff1bcfb0d563284))

# [2.19.0](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.18.3...@umijs/plugin-qiankun@2.19.0) (2021-01-12)

### Features

- **qiankun:** 优化代码，移除运行时 require 方式引入模块 ([#503](https://github.com/umijs/plugins/issues/503)) ([6e38d82](https://github.com/umijs/plugins/commit/6e38d8245682b2b12f6b9d403b2c07d372651087))

## [2.18.3](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.18.2...@umijs/plugin-qiankun@2.18.3) (2020-12-24)

**Note:** Version bump only for package @umijs/plugin-qiankun

## [2.18.2](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.18.1...@umijs/plugin-qiankun@2.18.2) (2020-12-15)

### Bug Fixes

- qiankun expor types ([#476](https://github.com/umijs/plugins/issues/476)) ([136652a](https://github.com/umijs/plugins/commit/136652a51b9c93eb2679a1ca19bffc405532abd3))

## [2.18.1](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.18.0...@umijs/plugin-qiankun@2.18.1) (2020-12-03)

### Bug Fixes

- **qiankun:** 修复 runtimePublicPath 开发环境无法读取用户配置的 publicPath 的问题 ([#470](https://github.com/umijs/plugins/issues/470)) ([843772a](https://github.com/umijs/plugins/commit/843772aca8b512d78615493bf1b5c781a0fb214f))

# [2.18.0](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.17.5...@umijs/plugin-qiankun@2.18.0) (2020-11-24)

### Bug Fixes

- **qiankun:** MicroAppWithMemoHistory 组件 name 变化时，history 也需要发生变化 ([#456](https://github.com/umijs/plugins/issues/456)) ([7f15836](https://github.com/umijs/plugins/commit/7f1583642b8999b516688ac21bdf9cf30f475646))
- MicroApp 每次 name 变更需要重新加载微应用 ([#438](https://github.com/umijs/plugins/issues/438)) ([3173c7d](https://github.com/umijs/plugins/commit/3173c7da90851be9f4ca03fd5bf67276957f9f4d))

### Features

- **qiankun:** 支持 runtime 期间配置微应用绑定的路由 ([#453](https://github.com/umijs/plugins/issues/453)) ([3a9e805](https://github.com/umijs/plugins/commit/3a9e8050255a15a9157d38d27a56116bb89d3d3c))

## [2.17.5](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.17.4...@umijs/plugin-qiankun@2.17.5) (2020-11-19)

### Bug Fixes

- **qiankun:** api.userConfig.qiankun.slave 可能为空 ([#449](https://github.com/umijs/plugins/issues/449)) ([d3a41cf](https://github.com/umijs/plugins/commit/d3a41cfe07d838bb9efe4f02f7adc0307c43e33d))

## [2.17.4](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.17.3...@umijs/plugin-qiankun@2.17.4) (2020-11-19)

### Bug Fixes

- **qiankun:** cannot disable default router base via config ([#444](https://github.com/umijs/plugins/issues/444)) ([88f6303](https://github.com/umijs/plugins/commit/88f63034c64b74796a0a37a1ca27ce5ac3293526))
- **qiankun:** useModel 父子应用通信无法在切换应用时保持最新的全局数据 ([#436](https://github.com/umijs/plugins/issues/436)) ([d75f153](https://github.com/umijs/plugins/commit/d75f153fba0098005a32e74da95c1f3e761de9bb)), closes [#426](https://github.com/umijs/plugins/issues/426)

## [2.17.3](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.17.2...@umijs/plugin-qiankun@2.17.3) (2020-10-27)

### Bug Fixes

- **qiankun:** 修复 clientRenderOpts 可能为空的问题 ([#424](https://github.com/umijs/plugins/issues/424)) ([28a1493](https://github.com/umijs/plugins/commit/28a1493c73c81f8c00435cf2946806cca5eaffdf))

## [2.17.2](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.17.1...@umijs/plugin-qiankun@2.17.2) (2020-10-27)

### Bug Fixes

- **qiankun:** remount 时创建的 history 为旧的 history ([#423](https://github.com/umijs/plugins/issues/423)) ([1801b4d](https://github.com/umijs/plugins/commit/1801b4df4527dc6e331d07f3c0edf08fe460aa3b))

## [2.17.1](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.17.0...@umijs/plugin-qiankun@2.17.1) (2020-10-26)

### Bug Fixes

- **qiankun:** 修复 slave 子应用独立运行时多创建了一个 history 导致的 业务 history.push 失效的问题 ([#421](https://github.com/umijs/plugins/issues/421)) ([9556420](https://github.com/umijs/plugins/commit/955642038bf3c76d3bf7173e69ff08a53e3ad753))

# [2.17.0](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.16.0...@umijs/plugin-qiankun@2.17.0) (2020-10-23)

### Features

- **qiankun:** 支持一屏展示多个 umi 应用渲染实例 ([#418](https://github.com/umijs/plugins/issues/418)) ([67a82e0](https://github.com/umijs/plugins/commit/67a82e0717b223445869173a4664292cda4a9f60))

# [2.16.0](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.15.0...@umijs/plugin-qiankun@2.16.0) (2020-10-12)

### Features

- **qiankun:** 兼容 webpack5 ([#404](https://github.com/umijs/plugins/issues/404)) ([0f45586](https://github.com/umijs/plugins/commit/0f455861b219b9102e998a8f7b865ce3d7fc4bb8))

# [2.15.0](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.14.3...@umijs/plugin-qiankun@2.15.0) (2020-10-09)

### Features

- **qiankun:** 兼容配置了 routeBindingAlias 同时又使用了原 microApp 的方式 ([#402](https://github.com/umijs/plugins/issues/402)) ([9b330d0](https://github.com/umijs/plugins/commit/9b330d0a2873a529c3154c7171024339cb5fb995))

## [2.14.3](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.14.2...@umijs/plugin-qiankun@2.14.3) (2020-09-22)

### Bug Fixes

- **qiankun:** 微应用支持读取运行时 history basename ([#396](https://github.com/umijs/plugins/issues/396)) ([b07435a](https://github.com/umijs/plugins/commit/b07435ae672a95d235b6509aef2a0d748cc85ee2))

## [2.14.2](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.14.1...@umijs/plugin-qiankun@2.14.2) (2020-09-22)

### Bug Fixes

- **qiankun:** no cjs require, use umiExports.MicroApp ([#395](https://github.com/umijs/plugins/issues/395)) ([c679b30](https://github.com/umijs/plugins/commit/c679b30425bde3e1274efca5b8051861c578a026))

## [2.14.1](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.14.0...@umijs/plugin-qiankun@2.14.1) (2020-09-22)

### Bug Fixes

- **qiankun:** 自动 loading 默认关 ([#394](https://github.com/umijs/plugins/issues/394)) ([523c96a](https://github.com/umijs/plugins/commit/523c96a77b7f1ecdc26dae771abda194c1fa8172))

# [2.14.0](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.13.1...@umijs/plugin-qiankun@2.14.0) (2020-09-21)

### Bug Fixes

- **qiankun:** 修复配置序列化异常的问题 ([#386](https://github.com/umijs/plugins/issues/386)) ([6903652](https://github.com/umijs/plugins/commit/690365292c9614f9302dabfa3348a734676978a2))
- **qiankun:** 默认开启 loading 动画 ([#385](https://github.com/umijs/plugins/issues/385)) ([857347e](https://github.com/umijs/plugins/commit/857347ee77f3d7d3a5d2d778c4aabbc6127a5eae))

### Features

- **qiankun:** 支持通过配置 autoSetLoading 自动开启 loading 动画 ([#384](https://github.com/umijs/plugins/issues/384)) ([5ce53a1](https://github.com/umijs/plugins/commit/5ce53a17b07f7e9105e3f39740b13a7a831e53ae))

## [2.13.1](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.13.0...@umijs/plugin-qiankun@2.13.1) (2020-09-21)

### Bug Fixes

- **qiankun:** pathToRegexp fix ([#382](https://github.com/umijs/plugins/issues/382)) ([8053e49](https://github.com/umijs/plugins/commit/8053e493a296ea519e35f060f9272f9ea480ab88))
- fix a warning when build plugin qiankun ([#355](https://github.com/umijs/plugins/issues/355)) ([5d1b01c](https://github.com/umijs/plugins/commit/5d1b01cce21ce09242a725d037441ce1e285b06b))

# [2.13.0](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.12.1...@umijs/plugin-qiankun@2.13.0) (2020-09-21)

### Features

- **qiankun:** support to access history ref for slave ([#370](https://github.com/umijs/plugins/issues/370)) ([fe8979a](https://github.com/umijs/plugins/commit/fe8979aa74cb91cd3e546ed1dd8125c249b872e3))

## [2.12.1](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.12.0...@umijs/plugin-qiankun@2.12.1) (2020-09-17)

### Bug Fixes

- **qiankun:** type missing in MicroAppWithMemoHistory ([#367](https://github.com/umijs/plugins/issues/367)) ([13d7df8](https://github.com/umijs/plugins/commit/13d7df8eeaa28b38bb458a50ce838acfd28d53c2))

# [2.12.0](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.11.0...@umijs/plugin-qiankun@2.12.0) (2020-09-15)

### Bug Fixes

- **qiankun:** 支持未开启 useModel 的场景 ([#360](https://github.com/umijs/plugins/issues/360)) ([1020281](https://github.com/umijs/plugins/commit/10202810ab8c1cda42a49b632e8fa1e23ce51a1b))

### Features

- **qiankun:** 支持运行时同时配置 master 和 slave ([#359](https://github.com/umijs/plugins/issues/359)) ([8bd928b](https://github.com/umijs/plugins/commit/8bd928bf866802918129d6b02ef8216f7a7377de))

# [2.11.0](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.10.0...@umijs/plugin-qiankun@2.11.0) (2020-08-31)

### Features

- **qiankun:** socket-server 支持从 HOST 环境变量中生成 ([#353](https://github.com/umijs/plugins/issues/353)) ([0b1eecb](https://github.com/umijs/plugins/commit/0b1eecbd3ea11088184783525bdf7868893548d4))

# [2.10.0](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.9.1...@umijs/plugin-qiankun@2.10.0) (2020-08-28)

### Features

- **plugin-qiankun:** add MicroAppWithMemomyHistory and connectMaster ([#352](https://github.com/umijs/plugins/issues/352)) ([75c51ff](https://github.com/umijs/plugins/commit/75c51ff927114d2fca77a9400eb8e350f4c0c651))

## [2.9.1](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.9.0...@umijs/plugin-qiankun@2.9.1) (2020-08-25)

### Bug Fixes

- **qiankun:** npm package file lost ([#341](https://github.com/umijs/plugins/issues/341)) ([8a06f02](https://github.com/umijs/plugins/commit/8a06f0257b55cfe1010748348fedf673c8a63c6a))

# [2.9.0](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.8.1...@umijs/plugin-qiankun@2.9.0) (2020-08-25)

### Features

- enhancement for mfsu ([#326](https://github.com/umijs/plugins/issues/326)) ([655c0da](https://github.com/umijs/plugins/commit/655c0da475748a0671dd3a5de8ab079dbe1bed5a))

## [2.8.1](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.8.0...@umijs/plugin-qiankun@2.8.1) (2020-08-20)

### Bug Fixes

- **qiankun:** 完善类型 ([#335](https://github.com/umijs/plugins/issues/335)) ([6671e12](https://github.com/umijs/plugins/commit/6671e12f70710baab87cbbcd5be040cf89c6a9cc))

# [2.8.0](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.7.0...@umijs/plugin-qiankun@2.8.0) (2020-08-19)

### Features

- **qiankun:** expose plugin enable api ([#333](https://github.com/umijs/plugins/issues/333)) ([164ae2f](https://github.com/umijs/plugins/commit/164ae2f377877ae7321b1579b8b09b3ae5f4f80e))

# [2.7.0](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.6.1...@umijs/plugin-qiankun@2.7.0) (2020-08-12)

### Features

- 完善 MicroApp history 类型 ([#322](https://github.com/umijs/plugins/issues/322)) ([d289228](https://github.com/umijs/plugins/commit/d289228ac1b4ee84c5c20bf480199182c84c7661))

## [2.6.1](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.6.0...@umijs/plugin-qiankun@2.6.1) (2020-07-31)

### Bug Fixes

- **qiankun:** fix slave options retire bug ([#314](https://github.com/umijs/plugins/issues/314)) ([432fcb2](https://github.com/umijs/plugins/commit/432fcb29cef8cef3f8fe3db6caa838eff79400b9))

# [2.6.0](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.5.1...@umijs/plugin-qiankun@2.6.0) (2020-07-30)

### Features

- **qiankun:** support to pass container for different sub apps ([#310](https://github.com/umijs/plugins/issues/310)) ([ff9a499](https://github.com/umijs/plugins/commit/ff9a4991f1be50d3a4aa89cd25f956386d4e1662))
- **qiankun:** 支持运行时动态设置 clientRender 的 rootElement ([#312](https://github.com/umijs/plugins/issues/312)) ([e90e0ca](https://github.com/umijs/plugins/commit/e90e0ca1b1178675e985389eae2623ebee4aa53d))

## [2.5.1](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.5.0...@umijs/plugin-qiankun@2.5.1) (2020-07-08)

### Bug Fixes

- **qiankun:** concat not defined in MicroApp ([#298](https://github.com/umijs/plugins/issues/298)) ([2b65bf7](https://github.com/umijs/plugins/commit/2b65bf7d5af90565b4a77b17fb20602312129dfb))

# [2.5.0](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.4.1...@umijs/plugin-qiankun@2.5.0) (2020-07-08)

### Features

- **qiankun:** microApp auto setLoading ([#293](https://github.com/umijs/plugins/issues/293)) ([18c15f2](https://github.com/umijs/plugins/commit/18c15f2f041b7abffa826f665d6f88d9289479c8))
- **qiankun:** MicroApp support lifeCycles ([#296](https://github.com/umijs/plugins/issues/296)) ([def736b](https://github.com/umijs/plugins/commit/def736b5830e7e41bdd4c24319e4c0c659aa751d))

## [2.4.1](https://github.com/umijs/plugins/compare/@umijs/plugin-qiankun@2.4.0...@umijs/plugin-qiankun@2.4.1) (2020-07-04)

### Bug Fixes

- **qiankun:** 修复 mounting 期间更新操作丢失 & 短时间内连续更新会抛状态异常的问题 ([#289](https://github.com/umijs/plugins/issues/289)) ([2456e40](https://github.com/umijs/plugins/commit/2456e409e59baa2a04f3638b27f6448363892e51))

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
