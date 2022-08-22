import { ProLayoutProps } from '@ant-design/pro-layout';
import { Models } from '@@/plugin-model/useModel';

export type RunTimeLayoutConfig = (
  initData: Models<'@@initialState'>,
) => ProLayoutProps & {
  childrenRender?: (dom: JSX.Element, props: ProLayoutProps) => React.ReactNode,
  unAccessible?: JSX.Element,
  noFound?: JSX.Element,
};

// avoid `export *` error
export default {};
