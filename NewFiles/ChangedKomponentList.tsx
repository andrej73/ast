import * as React from 'react';
const ChangedComponent = (props: any) => {
  const data = ['Item 1', 'Item 2', 'Item 3'];
  const [anotherData] = useChangedQuery();

  return (
    <div>
      <h1>Hello!</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default ChangedComponent;
function useChangedQuery(): [any] {
  throw new Error('Function not implemented.');
}
