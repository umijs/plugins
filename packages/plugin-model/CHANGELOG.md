# Change Log

All notable changes to this project will be documented in this file. See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.6.2](https://github.com/umijs/plugins/compare/@umijs/plugin-model@2.6.1...@umijs/plugin-model@2.6.2) (2021-11-12)

### Bug Fixes

- **layout:** fix login render twice error ([#740](https://github.com/umijs/plugins/issues/740)) ([6c9bd9d](https://github.com/umijs/plugins/commit/6c9bd9d2a829f5a86b6fc9d710da7cb5195a3aa3))

## [2.6.1](https://github.com/umijs/plugins/compare/@umijs/plugin-model@2.6.0...@umijs/plugin-model@2.6.1) (2021-06-03)

**Note:** Version bump only for package @umijs/plugin-model

# [2.6.0](https://github.com/umijs/plugins/compare/@umijs/plugin-model@2.5.7...@umijs/plugin-model@2.6.0) (2021-05-20)

### Features

- fix plugin-model runtime to adapt mfsu ([#615](https://github.com/umijs/plugins/issues/615)) ([48c69ff](https://github.com/umijs/plugins/commit/48c69ff2a296243045ea763aa857016da8e91379))

## [2.5.7](https://github.com/umijs/plugins/compare/@umijs/plugin-model@2.5.6...@umijs/plugin-model@2.5.7) (2021-04-20)

### Bug Fixes

- ie11 useModel throw error on state changes ([#588](https://github.com/umijs/plugins/issues/588)) ([9100e4d](https://github.com/umijs/plugins/commit/9100e4d9364edaae17c0b12a6f69f8918dbbb639))

## [2.5.6](https://github.com/umijs/plugins/compare/@umijs/plugin-model@2.5.5...@umijs/plugin-model@2.5.6) (2020-10-27)

### Bug Fixes

- 通过改变 key 卸载时导致的循环问题 ([#422](https://github.com/umijs/plugins/issues/422)) ([54278e3](https://github.com/umijs/plugins/commit/54278e3c96dc33b722eb49c8839db4f6cfb30533))

## [2.5.5](https://github.com/umijs/plugins/compare/@umijs/plugin-model@2.5.4...@umijs/plugin-model@2.5.5) (2020-10-16)

### Bug Fixes

- useModel 首次注册 handler 后没有立即同步状态到 dispatcher ([#408](https://github.com/umijs/plugins/issues/408)) ([ebd1225](https://github.com/umijs/plugins/commit/ebd122517827bc55604cf74fd5f0800fe668fc2e))

## [2.5.4](https://github.com/umijs/plugins/compare/@umijs/plugin-model@2.5.3...@umijs/plugin-model@2.5.4) (2020-09-21)

### Bug Fixes

- update state failed when unmount component immediate after update ([#381](https://github.com/umijs/plugins/issues/381)) ([c8078ac](https://github.com/umijs/plugins/commit/c8078ac31ef9df6d501aa3074f116dfe569afb26))

## [2.5.3](https://github.com/umijs/plugins/compare/@umijs/plugin-model@2.5.2...@umijs/plugin-model@2.5.3) (2020-08-12)

**Note:** Version bump only for package @umijs/plugin-model

## [2.5.2](https://github.com/umijs/plugins/compare/@umijs/plugin-model@2.5.1...@umijs/plugin-model@2.5.2) (2020-08-12)

**Note:** Version bump only for package @umijs/plugin-model

## [2.5.1](https://github.com/umijs/plugins/compare/@umijs/plugin-model@2.5.0...@umijs/plugin-model@2.5.1) (2020-07-07)

### Bug Fixes

- ssr ([#295](https://github.com/umijs/plugins/issues/295)) ([1135b88](https://github.com/umijs/plugins/commit/1135b881f179973ad33a52fb7636fb2b57c874c2))

# [2.5.0](https://github.com/umijs/plugins/compare/@umijs/plugin-model@2.4.0...@umijs/plugin-model@2.5.0) (2020-07-03)

### Features

- useModel devTool 支持 ([#276](https://github.com/umijs/plugins/issues/276)) ([d381aa2](https://github.com/umijs/plugins/commit/d381aa230c33545aa12614caa3a627852d142972))

# [2.4.0](https://github.com/umijs/plugins/compare/@umijs/plugin-model@2.3.2...@umijs/plugin-model@2.4.0) (2020-06-22)

### Features

- useModel register support exportName ([#264](https://github.com/umijs/plugins/issues/264)) ([b1c6ed3](https://github.com/umijs/plugins/commit/b1c6ed373acae333cf5729af9757a6243103d293))

## [2.3.2](https://github.com/umijs/plugins/compare/@umijs/plugin-model@2.3.1...@umijs/plugin-model@2.3.2) (2020-06-20)

### Bug Fixes

- the lastStateRef repeat setting ([#229](https://github.com/umijs/plugins/issues/229)) ([#260](https://github.com/umijs/plugins/issues/260)) ([2b8e12c](https://github.com/umijs/plugins/commit/2b8e12c6618bc7df05b8df11dde270331c1a606a))

## [2.3.1](https://github.com/umijs/plugins/compare/@umijs/plugin-model@2.3.0...@umijs/plugin-model@2.3.1) (2020-05-01)

### Bug Fixes

- File path under Win ([#184](https://github.com/umijs/plugins/issues/184)) ([4980864](https://github.com/umijs/plugins/commit/49808646b6991ce13cdced37102bb4b61ce378e7))

# [2.3.0](https://github.com/umijs/plugins/compare/@umijs/plugin-model@2.2.0...@umijs/plugin-model@2.3.0) (2020-04-24)

### Bug Fixes

- 添加 page 作为 singular 匹配 ([5d252d8](https://github.com/umijs/plugins/commit/5d252d85fd1643e5f829f59d75486b8ff79ec4cb))

### Features

- 命名空间添加目录前缀避免命名空间重复 ([b72c5d8](https://github.com/umijs/plugins/commit/b72c5d8497333df3f7c509d26347b28525a99b4b))
- 添加页面组件 useModel 配置 ([29ad36e](https://github.com/umijs/plugins/commit/29ad36e27234458a6111b5ee8bfb0244ed7acb0f))

# [2.2.0](https://github.com/umijs/plugins/compare/@umijs/plugin-model@2.1.4...@umijs/plugin-model@2.2.0) (2020-03-24)

### Features

- setInitialState ([#123](https://github.com/umijs/plugins/issues/123)) ([17449b2](https://github.com/umijs/plugins/commit/17449b26f227347f909116cd33f7dccfe2d56013))

## [2.1.4](https://github.com/umijs/plugins/compare/@umijs/plugin-model@2.1.3...@umijs/plugin-model@2.1.4) (2020-03-23)

**Note:** Version bump only for package @umijs/plugin-model

## [2.1.3](https://github.com/umijs/plugins/compare/@umijs/plugin-model@2.1.2...@umijs/plugin-model@2.1.3) (2020-03-18)

### Bug Fixes

- access hmr ([baacdf2](https://github.com/umijs/plugins/commit/baacdf22bf84682c90698d722866aa8fe6f8edb9))

## [2.1.2](https://github.com/umijs/plugins/compare/@umijs/plugin-model@2.1.1...@umijs/plugin-model@2.1.2) (2020-03-10)

**Note:** Version bump only for package @umijs/plugin-model

## [2.1.1](https://github.com/umijs/plugins/compare/@umijs/plugin-model@2.1.0...@umijs/plugin-model@2.1.1) (2020-03-04)

### Bug Fixes

- resolve warnings on React 16.13 ([#65](https://github.com/umijs/plugins/issues/65)) ([5f3f85e](https://github.com/umijs/plugins/commit/5f3f85ec3ddc24a581b09caad1c93fc14b70101b))

# [2.1.0](https://github.com/umijs/plugins/compare/@umijs/plugin-model@2.0.1...@umijs/plugin-model@2.1.0) (2020-02-17)

### Features

- disable plugin-model when no hooks model is defined ([#30](https://github.com/umijs/plugins/issues/30)) ([16ea6ed](https://github.com/umijs/plugins/commit/16ea6ed2e891d16ee6c01c2895a9f8fd82d44a9c))
- migrate plugin-initial-state ([#27](https://github.com/umijs/plugins/issues/27)) ([e20c7df](https://github.com/umijs/plugins/commit/e20c7df769411d003366c150bb38ff438b9d56fc))

## [2.0.1](https://github.com/umijs/plugins/compare/@umijs/plugin-model@0.1.0...@umijs/plugin-model@2.0.1) (2020-02-04)

**Note:** Version bump only for package @umijs/plugin-model

# 2.0.0 (2020-02-04)

### Bug Fixes

- ci ([0103895](https://github.com/umijs/plugins/commit/0103895dc6f4cf63bb8e0da120494b2d7e40af01))

### Features

- implement plugin-model ([734e5d6](https://github.com/umijs/plugins/commit/734e5d6264628376ac0219e97f434693db61e9d5))
- plugin-antd ([4ea5101](https://github.com/umijs/plugins/commit/4ea510187687fb9ce45449c6a6bb07182b761edc))
