import React from 'react';
import { useModel, history } from 'umi';

export default () => {
  const { initialState, loading, setInitialState } = useModel('@@initialState');
  const { description } = useModel('bar');
  return (
    <div>
      <h1>
        initial-state: {loading ? 'loading...' : JSON.stringify(initialState)}
      </h1>
      <h1 data-cy="another-model-count">
        count from another model: {description}
      </h1>
      <button onClick={() => setInitialState({ name: 'a name' })}>
        change name
      </button>
      <button onClick={() => setInitialState({ name: 'another name' })}>
        change another name
      </button>
      <div>
        <button
          onClick={() => {
            history.push('/plugin-model');
          }}
          data-cy="go-back-plugin-model"
        >
          go back model
        </button>
      </div>
    </div>
  );
};
