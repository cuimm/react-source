// import React from 'react';
// import ReactDOM from 'react-dom';

import React from './source/react';
import ReactDOM from './source/react-dom';

/**
    自定义hooks
    1、必须是一个function
    2、方法名必须是use开头
    3、在函数内部必须调用其他的hooks

    - 自定义hooks复用的是逻辑，而非状态本身。
 */
function useCounter(initialState) {
  const [number, setNumber] = React.useState(initialState);

  const handleClick = () => {
    setNumber(number + 1);
  };

  return [number, handleClick];
}

function Counter1() {
  let [number, handleClick] = useCounter(100);

  return (
      <div>
        <div>{number}</div>
        <button onClick={handleClick}>+</button>
      </div>
  );
}

function Counter2() {
  let [number, handleClick] = useCounter(200);

  return (
      <div>
        <div>{number}</div>
        <button onClick={handleClick}>+</button>
      </div>
  );
}

ReactDOM.render((
    <div>
      <Counter1/>
      <Counter2/>
    </div>
), document.getElementById('root'));



/* 不使用自定义hooks
function Counter1() {
  let [number, setNumber] = React.useState(100);

  const handleClick = () => {
    setNumber(number + 1);
  };

  return (
      <div>
        <div>{number}</div>
        <button onClick={handleClick}>+</button>
      </div>
  );
}

function Counter2() {
  let [number, setNumber] = React.useState(200);

  const handleClick = () => {
    setNumber(number + 1);
  };

  return (
      <div>
        <div>{number}</div>
        <button onClick={handleClick}>+</button>
      </div>
  );
}

ReactDOM.render((
    <div>
      <Counter1/>
      <Counter2/>
    </div>
), document.getElementById('root'));
*/
