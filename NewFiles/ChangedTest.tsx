import * as React from 'react';

function MyComponent(props: any) {
  const greet = (name: any) => {
    return `Hello, ${name}!`;
  };

  return (
    <div>
      <h1>My React Component</h1>
      <p>{greet('John')}</p>
    </div>
  );
}

export default MyComponent;
