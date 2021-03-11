# @umijs/plugin-svg-icon

> @umijs/plugin-svg-icon.

See our website [@umijs/plugin-sass](https://umijs.org/plugins/plugin-svg-icon) for more information.

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

安装即可开启

如果想要自己配置 svgo 配置，可以在.umirc 配置文件同级下增加 svgo-config.json

实际使用：

```jsx
const requireAll = (requireContext) => {
  requireContext.keys().map(requireContext);
};
const req = require.context('./assets/svgs', false, /\.svg$/);
requireAll(req);

export const Icon = forwardRef((props, ref) => {
  const { type, className, link, ...htmlProps } = props;
  const iconName = `#icon-${type}`;
  const iconClassName = classNames(
    'svg-icon',
    `svg-icon-${props.type}`,
    className,
  );
  const Parent = link ? 'a' : 'i';
  const icon = (
    <Parent ref={ref} className={iconClassName} {...htmlProps}>
      <svg aria-hidden="true">
        <use xlinkHref={iconName} />
      </svg>
    </Parent>
  );
  return icon;
});
```

## TODO

将示例的 jsx 代码整合到插件内部
