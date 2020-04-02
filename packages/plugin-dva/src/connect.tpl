import { IRoute } from '@umijs/core';
import { AnyAction } from 'redux';
import React from 'react';
import { EffectsCommandMap, SubscriptionAPI } from 'dva';
import { match } from 'react-router-dom';
import { Location, LocationState, History } from 'history';

{{{ dvaHeadImport }}}

{{{ dvaHeadExport }}}

export interface Action<T = any> {
  type: T
}

export type Reducer<S = any, A extends Action = AnyAction> = (
  state: S | undefined,
  action: A
) => S;

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

export type Subscription = (api: SubscriptionAPI, done: Function) => void | Function;

export interface Loading {
  global: boolean;
  effects: { [key in keyof EffectActionsMap]?: boolean };
  models: {
{{{ dvaLoadingModels }}}
  };
}

/**
 * @type P: Params matched in dynamic routing
 */
export interface ConnectProps<P extends { [K in keyof P]?: string } = {}, S = LocationState> {
  dispatch?: Dispatch;
  // https://github.com/umijs/umi/pull/2194
  match?: match<P>;
  location: Location<S>;
  history: History;
  route: IRoute;
}

/**
 * @type T: React props
 * @type U: match props types
 */
export type ConnectRC<T = {}, U = {}> = React.ForwardRefRenderFunction<any, T & ConnectProps<U>>;

type ArgsType<T extends (...args: any[]) => any> = T extends (...args: infer U) => any ? U : never;

type AnyActionsMap = { [key: string]: (...args: any[]) => any };

type PickEffectAction<
  T extends { effects: AnyActionsMap },
  U extends keyof T['effects']
> = ArgsType<T['effects'][U]>[0];

type PickReducerAction<
  T extends { reducers: AnyActionsMap },
  U extends keyof T['reducers']
> = ArgsType<T['reducers'][U]>[1];

export interface EffectActionsMap {
{{{ dvaEffectsMap }}}
}

export interface ReducerActionsMap {
{{{ dvaReducersMap }}}
}

export interface ActionsMap extends EffectActionsMap, ReducerActionsMap {}

export type StrictDispatch = <T extends keyof ActionsMap>(
  action: { type: T } & Pick<ActionsMap[T], Exclude<keyof ActionsMap[T], 'type'>>,
) => any;
