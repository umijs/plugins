export default (relEntryFile: string) =>
  relEntryFile
    ? `// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { Models } from '../../plugin-model/useModel';
import * as app from '../../../app';

const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay||0));

export type InitialState = Models<'@@initialState'>;

async function getInitialState() {
  return await app.getInitialState();
}

type ThenArg<T> = T extends Promise<infer U> ? U : T;

const initState = {
  initialState: undefined as ThenArg<ReturnType<typeof getInitialState>> | undefined,
  loading: true,
  error: undefined as Error | undefined,
};

type InitialStateType = ThenArg<ReturnType<typeof getInitialState>> | undefined;

type InitialStateTypeFn = (
  initialState: InitialStateType,
) => ThenArg<ReturnType<typeof getInitialState>> | undefined;

export default () => {
  const [state, setState] = useState(initState);

  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: undefined }));
    try {
      const asyncFunc = () => new Promise<InitialStateType>((res) => res(getInitialState()));
      const ret = await asyncFunc();
      setState((s) => ({ ...s, initialState: ret, loading: false }));
    } catch (e) {
      setState((s) => ({ ...s, error: e, loading: false }));
    }
    await sleep(10)
  }, []);

  const setInitialState = useCallback(async (initialState: InitialStateType | InitialStateTypeFn) => {
    setState((s) => {
      if (typeof initialState === 'function') {
        return { ...s, initialState: initialState(s.initialState), loading: false };
      }
      return { ...s, initialState, loading: false };
    });
    await sleep(10)
  }, []);

  useEffect(() => {
    refresh();
  }, []);

  return {
    ...state,
    refresh,
    setInitialState,
  };
};
`
    : 'export default () => ({ loading: false, refresh: () => {} })';
