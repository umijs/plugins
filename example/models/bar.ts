import React from 'react';

export default function() {
  const [count, setCount] = React.useState(0);
  return {
    description: count,
    setCount,
  };
}
