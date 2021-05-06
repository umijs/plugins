import React, { forwardRef } from 'react';

import '../assets/svgs/love.svg';
import '../assets/svgs/alipay.svg';
// @ts-ignore
import { ReactComponent as Wechat } from '../assets/svg/wechat.svg';
// import { SvgIcon } from 'umi';

const Icon = forwardRef((props: any, ref) => {
  const { type, className, link, ...htmlProps } = props;
  const iconName = `#icon-${type}`;
  const Parent = link ? 'a' : 'i';
  return (
    <Parent ref={ref} className={`svg-icon svg-icon-${props.type}`} {...htmlProps}>
      <svg aria-hidden='true'>
        <use xlinkHref={iconName} />
      </svg>
    </Parent>
  );
});
const App = () => {
  return (
    <>
      {/*<SvgIcon type={'love'} />*/}
      {/*<SvgIcon type={'alipay'} />*/}
      <Icon type={'love'} />
      <Icon type={'alipay'} />
      <Wechat width={90} height={120}/>
    </>

  );
};
export default App;
