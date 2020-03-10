import { IRoute } from '@umijs/core';
import { AnyAction } from 'redux';
import { EffectsCommandMap } from 'dva';
import { match } from 'react-router-dom';
import { Location, LocationState, History } from 'history';

{{{ dvaHeadExport }}}

export interface Action<T = any> {
  type: T
}

export type Reducer<S = any, A extends Action = AnyAction> = (
  state: S | undefined,
  action: A
) => S


export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap,
) => void;

/**
 * @type P: Type of payload
 * @type C: Type of callback
 */
export type Dispatch = <P = any, C = (payload: P) => void>(action: {
  type: string;
  payload?: P;
  callback?: C;
  [key: string]: any;
}) => any;

export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    {{{ dvaLoadingModels }}}
  };
}

/**
 * @type P: Params matched in dynamic routing
 */
export interface ConnectProps<P extends { [K in keyof P]?: string } = {}, S = LocationState>
  extends Partial<IRoute> {
  dispatch?: Dispatch;
  // https://github.com/umijs/umi/pull/2194
  match?: match<P>;
  location: Location<S>;
  history: History;
  route: IRoute;
}

