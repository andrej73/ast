import React from 'react';
const ReplacedComponent = (props: any) => {
  const data = ['Item 1', 'Item 2', 'Item 3'];
  const [anotherData] = useReplacedQuery();

  return (
    <div>
      <h1>Hello from EntityComponent!</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default ReplacedComponent;
function useReplacedQuery(): [any] {
  throw new Error('Function not implemented.');
}
