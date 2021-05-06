import React, { AnchorHTMLAttributes, ClassAttributes, forwardRef } from 'react';
import classNames from 'classnames';

const requireAll = (requireContext: any) => {
  requireContext?.keys()?.map(requireContext);
};

// @ts-ignore
try {
  const req = require.context('./assets/svgs', false, /\.svg$/);
  requireAll(req);
} catch (e) {
  console.warn("[svg-icon] doesn't find svg files at './assets/svgs'!");
}

export type SvgIconProps = {
  type: string,
  className: string,
  link: boolean,
  ref: React.Ref<any>;
} & ClassAttributes<HTMLAnchorElement> & AnchorHTMLAttributes<HTMLAnchorElement>
/**
 * @description SvgIcon 组件，自动引入./assets/svgs目录下的所有svg文件并生成svg雪碧图<p/>
 *
 * @param type string svg文件名称
 *
 * @param className string svg的文件名称
 *
 * @param link boolean 是非为链接 如果为链接父组件将有 i 变成 a 标签
 *
 * @param ref svg包裹的父层级的svg样式
 */
export const SvgIcon = forwardRef((props: SvgIconProps, ref) => {
  const { type, className, link, ...htmlProps } = props;
  const iconName = `#icon-${type}`;
  const iconClassName = classNames(
    'svg-icon',
    `svg-icon-${props.type}`,
    className,
  );
  const Parent = link ? 'a' : 'i';
  return (
    <Parent ref={ref} className={iconClassName} {...htmlProps}>
      <svg aria-hidden='true'>
        <use xlinkHref={iconName} />
      </svg>
    </Parent>
  );
});
