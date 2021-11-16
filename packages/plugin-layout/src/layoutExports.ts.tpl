import { BasicLayoutProps } from '@ant-design/pro-layout';
import { Models } from '@@/plugin-model/useModel';

export type RunTimeLayoutConfig = (
  initData: Models<'@@initialState'>,
) => BasicLayoutProps & {
  childrenRender?: (dom: JSX.Element, props: BasicLayoutProps) => React.ReactNode,
  unAccessible?: JSX.Element,
  noFound?: JSX.Element,
};

// avoid `export *` error
export default {};
