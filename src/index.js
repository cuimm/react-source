// import React from 'react';
// import ReactDOM from 'react-dom';

import React from './source/react';
import ReactDOM from './source/react-dom';

function Counter() {
  const [number, setNumber] = React.useState(0);
  const [number2, setNumber2] = React.useState(10);

  function handleClick() {
    setNumber(number + 1);
  }

  function handleClick2() {
    setNumber2(number2 + 10);
  }

  return (
      <div>
        <p>number: {number}</p>
        <button onClick={handleClick}>+</button>
        <p>number2: {number2}</p>
        <button onClick={handleClick2}>+</button>
      </div>
  );
}

ReactDOM.render(<Counter />, document.getElementById('root'))
