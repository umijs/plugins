import React from 'react';

const App = (props: any) => {
  return (
    <div>
      <h1>unAccessible: {props.route.unAccessible.toString()}</h1>
    </div>
  );
};

export default App;
