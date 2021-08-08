// import React from 'react';
// import ReactDOM from 'react-dom';

import React from './source/react';
import ReactDOM from './source/react-dom';

function Child({data, handleClick}) {
  console.log('Child render', data);
  return (
      <div>
        Child number: {data.number}
        <button onClick={handleClick}>+</button>
      </div>
  );
}

const MemoChild = React.memo(Child);

function App() {
  console.log('App render');

  const [name, setName] = React.useState('cuimm');
  const [number, setNumber] = React.useState(0);

  // const data = {number};
  // data修改如下：React.useMemo第一次会把factory执行的结果给data，第二次渲染的时候，会比较依赖项number是否改变，如果没有改变不会计算新的data值
  const data = React.useMemo(() => {
    return {
      number: number,
    }
  }, [number]);

  // function handleClick() {
  //   setNumber(number + 1);
  // }
  /**
   * handleClick 方法修改如下： deps第一次值为[0], 点击按钮执行handleClick会进行更新，deps的值更新为[1]
   * 如果依赖值没有变化，则会返回上次的callback函数，那么React.memo在返回的MemoChild组件内部props就没有改变 => 子组件Child不会重新渲染
   */
  const handleClick = React.useCallback(() => {
    setNumber(number + 1);
  }, [number]);

  // console.log('handleClick', handleClick);
  /*
  () => {
    setNumber(number + 1);
  }
  * */


  function handleInput(event) {
    setName(event.target.value);
  }

  return (
      <div>
        名字：<input placeholder="请输入名字" onInput={handleInput}/>
        <MemoChild data={data} handleClick={handleClick}/>
      </div>
  );
}
/*
function Child({data, handleClick}) {
  console.log('Child render');
  return (
      <div>
        {data.number}
        <button onClick={handleClick}>+</button>
      </div>
  );
}

const MemoChild = React.memo(Child); // 使用React.memo，Child组件依旧会在name值改变的时候渲染，因为每次dom diff的时候，data被重新赋值，shallowEqual浅比较返回false

function App() {
  console.log('App render');
  let [name, setName] = React.useState('cuimm');
  const [number, setNumber] = React.useState(0);

  const data = {number};

  function handleInput(event) {
    setName(event.target.value);
  }
  function handleNumber() {
    setNumber(number + 1);
  }
  return (
      <div>
        <input onInput={handleInput} />
        <MemoChild data={data} handleClick={handleNumber}/>
      </div>
  );
}
*/

/*
function Child({data, handleClick}) {
  console.log('Child render');
  return (
      <div>
        Child number: {data.number}
        <button onClick={handleClick}>+</button>
      </div>
  );
}

function App() {
  console.log('App render');

  const [name, setName] = React.useState('cuimm');
  const [number, setNumber] = React.useState(0);

  const data = {number};

  function handleInput(event) {
    setName(event.target.value);
  }

  function handleClick() {
    setNumber(number + 1);
  }

  return (
      <div>
        名字：<input placeholder="请输入名字" onInput={handleInput}/>
        <Child data={data} handleClick={handleClick}/>
      </div>
  );
}
*/
ReactDOM.render(<App/>, document.getElementById('root'))
