# @umijs/plugin-svg-icon

> @umijs/plugin-svg-icon.

See our website [@umijs/plugin-svg-icon](https://umijs.org/plugins/plugin-svg-icon) for more information.

## 安装

使用 npm:

```bash
$ npm install --save-dev @umijs/plugin-svg-icon
```

使用 yarn:

```bash
$ yarn add @umijs/plugin-svg-icon --dev
```

## 功能

自动配置 svgo 并将 svg 打包为 svg 雪碧图

## 使用方法

**注意 svg 文件只有放置在 svgs 的文件夹才会应用此配置!**

安装即可开启

如果想要自己配置 svgo 配置，可以在.umirc 配置文件同级下增加 svgo-config.json

实际使用：

- 1. 需要声明一个通用组件 ICON

```jsx
import { SvgIcon } from 'umi';
```

- 2. 使用此组件

```jsx
<Icon type={'love'} />
```

## TODO

- [ ] 1.将示例的 jsx 代码整合到插件内部。

- [ ] 2.升级 svgo 与 svg-sprite-loader 到最新版本

- [ ] 3.暴露 svg-sprite-loader 选项入口

## 为什么要使用此插件

- svg 优点多多，其在移动端有很强的适配能力，在 pc 端也可以防止图片变糊，可以多 svg 图片拼接组合等等，高效易用。但是，通常我们获得的 svg 图片并不能直接使用，它们可能来自第三方 svg 组件库，或者来自设计师的原稿输出，这些 svg 如果直接使用 svg as component 可能存在以下痛点：

  1.  我们需要 svg 图标携带 hover 样式，但是 svg 被填充了 fill 属性

  2.  内置的样式可能需要我们手动删除

  3.  携带一些内部敏感信息需要屏蔽

  4.  一个 svg 中的某部分全局中基本都有运用，但由于包裹的 svg 父元素不同可能会被多次请求。

  当 icon 变得非常多的时候这将是重复的体力劳动。

- 目前推荐对 svg 使用的是本插件的 svg-icon 与 url-loader 结合使用：

  1.  svg 确实需要内联样式的效果需要定制，请使用 svg as component。

  2.  有些 svg 不是全局 icon，而是单个引用，并且非常庞大还是需要使用 svg as component。

更多可以参考：[svg-sprite-loader](https://github.com/JetBrains/svg-sprite-loader) 与 [svgo](https://github.com/svg/svgo)
