import { useReducer } from 'react';

export default () => {
  function reducer(state, action) {
    switch (action.type) {
      case 'changeGender':
        return {
          ...state,
          gender: state.gender === 'male' ? 'female' : 'male',
        };
      case 'setAge':
        return {
          ...state,
          age: action.payload,
        };
      default:
        break;
    }
  }
  const [data, dispatch] = useReducer(reducer, {
    name: 'Troy',
    email: 'troy.lty@alipay.com',
    gender: 'male',
    height: '6\'2',
    age: 24,
  });
  return [
    data,
    dispatch,
  ];
}
