import { BasicLayoutProps, HeaderViewProps } from '@ant-design/pro-layout';
import { Models } from '@@/plugin-model/useModel';

export type RunTimeLayoutConfig = (
  initData: Models<'@@initialState'>,
) => Omit<BasicLayoutProps, 'rightContentRender'> & {
  childrenRender?: (dom: JSX.Element, props: BasicLayoutProps) => React.ReactNode,
  unAccessible?: JSX.Element,
  noFound?: JSX.Element,
  logout?: (initData) => Promise<void> | void,
  rightContentRender?: (props: HeaderViewProps, dom: JSX.Element, props: {
    userConfig: RunTimeLayoutConfig,
    loading: boolean,
    initialState,
    setInitialState,
  }) => JSX.Element,
};

// avoid `export *` error
export default {};
