// import React from 'react';
// import ReactDOM from 'react-dom';

import React from './source/react';
import ReactDOM from './source/react-dom';

// useEffect 不会阻塞浏览器渲染，在浏览器渲染结束之后执行。

// 4.每次开启新的定时器之前清空老的定时器（以下可行）
function Counter() {
  let [number, setNumber] = React.useState(0);
  console.log('1. render', number);

  // useEffect 不会阻塞dom渲染，内部是一个异步任务
  React.useEffect(() => {
    console.log('2. 开启一个定时器', number);

    const timer = setInterval(() => {
      console.log('3. 执行定时器 number', number);
      // setNumber(number + 1); // ok?（ok. 在执行下一次effect之前，会先执行销毁函数，上一次的timer被销毁，生成新的计时器，此时number会指向新的number的值）
      setNumber(number => number + 1); // ok
    }, 1000);

    // 返回销毁函数。在执行下一次的effect的时候，会先执行销毁函数。
    return () => {
      console.log('4. 清理定时器 number', number);
      clearInterval(timer);
    };
  }, [number]);

  console.log('counter');

  return <p>{number}</p>
}

// 1. render 0
// 2. 开启一个定时器 0
// 3. 执行定时器 number 0
// 1. render 1
// 4. 清理定时器 number 0
// 2. 开启一个定时器 1
// 3. 执行定时器 number 1
// 1. render 2
// 4. 清理定时器 number 1
// 2. 开启一个定时器 2
// 3. 执行定时器 number 2
// 1. render 3
// 4. 清理定时器 number 2
// 2. 开启一个定时器 3



/*
// 3、设置依赖数组（以下可行，setNumber传入回调函数）
function Counter() {
  let [number, setNumber] = React.useState(0);
  console.log('1. render', number);

  React.useEffect(() => {
    console.log('2. 开启一个定时器', number); // 此处因为依赖项（空数组）没有发生变化，所以只会执行一次
    setInterval(() => {
      console.log('3. 执行定时器 number', number); // 此处number始终是0
      setNumber(number => number + 1); // 因为闭包的原因（该定时器没有被销毁），number取到的是最新的值
    }, 1000);
  }, []);

  return <p>{number}</p>
}
// 1.render 0
// 2.开启一个定时器 0
// 3. 执行定时器 number 0
// 1. render 1
// 3. 执行定时器 number 0
// 1. render 2
// 3. 执行定时器 number 0
// 1. render 3
// 3. 执行定时器 number 0
*/

/*
// 2、设置依赖数组（以下不可行，死循环）
function Counter() {
  let [number, setNumber] = React.useState(0);
  console.log('1. render', number);

  React.useEffect(() => {
    console.log('2. 开启一个定时器', number); // 此处因为依赖数组(空数组[])没有发生变化，所以只会执行一次。
    setInterval(() => {
      console.log('3. 执行定时器 number', number); // 此处number始终为0（闭包）
      setNumber(number + 1);
    }, 1000);
  }, []);

  return <p>{number}</p>
}
// 1. render 0
// 2. 开启一个定时器 0
// 3. 执行定时器 number 0
// 1. render 1
// 3. 执行定时器 number 0
// 1. render 1
// 3. 执行定时器 number 0
// 3. 执行定时器 number 0
// 3. 执行定时器 number 0 ...
*/

/* 1、以下每1秒会创建一个定时器，死循环
function Counter() {
  let [number, setNumber] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      console.log('执行定时器 number', number);
      setNumber(number + 1);
    }, 1000);
  });

  return <p>{number}</p>
}
*/

/**
 * 如何保证只有一个定时器？
 * 1、设置依赖数组
 * 2、每次开启新的定时器之前清空老的定时器
 */


ReactDOM.render(<Counter />, document.getElementById('root'))
