import React from 'react';

const App = (props: any) => {
  return (
    <div>
      <h1>unaccessible: {props.route.unaccessible.toString()}</h1>
    </div>
  );
};

export default App;
