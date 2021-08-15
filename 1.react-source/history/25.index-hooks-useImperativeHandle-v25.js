// import React from 'react';
// import ReactDOM from 'react-dom';

import React from './source/react';
import ReactDOM from './source/react-dom';

/* dom 不安全
function Child(props, ref) {
  return <input ref={ref}/>
}
*/

function Child(props, ref) {
  const childRef = React.useRef();

  // 可以自定义暴露给父组件的ref实例
  React.useImperativeHandle(ref, () => {
    return {
      getFocus: () => {
        childRef.current.focus();
      },
      print() {
        console.log('print', childRef.current.value);
      },
    };
  });

  return (<input ref={childRef}/>);
}

// 函数组件没有实例，不能直接添加ref。
// 经过 forwardRef 转发过的函数组件，可以添加ref。
const ForwardChild = React.forwardRef(Child);

function Parent() {
  const childRef = React.useRef();

  const getFocus = () => {
    // childRef.current.focus(); // 此处可以拿到子组件实例，但是不安全。如：执行remove方法，子组件dom被删除。
    // childRef.current.remove();

    childRef.current.getFocus();
    childRef.current.print();
  };

  return (
      <div>
        <ForwardChild ref={childRef}/>
        <button onClick={getFocus}>获取焦点</button>
      </div>
  );
}

ReactDOM.render(<Parent />, document.getElementById('root'))
