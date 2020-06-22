/**
 * @author Kuitos
 * @since 2020-06-22
 */
import { useState } from 'react';

export default function useGlobalState() {
  const [globalState, setGlobalState] = useState({ p1: 'hello' });

  return {
    globalState,
    setGlobalState,
  };
}
