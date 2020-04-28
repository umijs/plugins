import { useState } from 'react';

export default () => {
  const [ counter, setCounter ] = useState(0);
  const increment = () => setCounter(c => c + 1);
  const decrement = () => setCounter(c => c - 1);
  return { counter, increment, decrement };
}
