import React, { useEffect } from 'react';
import { useModel } from './.umi/useModel';

export default (props) => {
  const { isAdult, name, dispatch } = useModel(
    'user',
    user => ({ name: user[0].name, isAdult: user[0].age > 18, dispatch: user[1] }),
  );
  useEffect(() => {
    props.onUpdate();
  });
  return (<>
    <h2 data-testid="user">{name} is {isAdult ? 'an adult' : 'a teen'}</h2>
    <button onClick={() => {
      dispatch({
        type: 'changeGender',
      });
    }}>changeGender</button>
    <button onClick={() => {
      dispatch({
        type: 'setAge',
        payload: 5,
      });
    }}>increaseAge</button>
  </>);
}
