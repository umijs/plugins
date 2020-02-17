# @umijs/plugin-fastclick

[FastClick](https://www.npmjs.com/package/fastclick) 插件

## 用法

```js
// .umirc.ts
export default {
  plugins: ['@umijs/plugin-fastclick'],
  fastclick: true,
};
```

更多配置

```js
{
  /** fastclick 配置 */
  touchBoundary: 10,
  tapDelay: 200,
  // 可自定义 fastClick 库路径
  libraryPath: '',
},
```
