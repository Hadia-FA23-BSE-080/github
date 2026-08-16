import React from 'react';

const Greeting = ({ name }) => {
  return (
    <div>
      <h1>Hello, {name || 'World'}!</h1>
      <p>Welcome to Vitest Testing in React.</p>
    </div>
  );
};

export default Greeting;
