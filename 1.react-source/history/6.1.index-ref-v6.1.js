// import React from 'react';
// import ReactDOM from 'react-dom';

import React from './source/react';
import ReactDOM from './source/react-dom';

const root = document.getElementById('root');

class Sum extends React.Component {
  numberA;
  numberB;
  sum;

  constructor(props) {
    super(props);

    this.numberA = React.createRef(); // 使用React.createRef()方法创建ref，ref用来存储DOM节点的引用
    this.numberB = React.createRef();
    this.sum = React.createRef();
  }

  handleClick = () => {
    const numberA = parseFloat(this.numberA.current.value);
    const numberB = parseFloat(this.numberB.current.value);
    this.sum.current.value = numberA + numberB;
  };

  render() {
    return (
        <div>
          <input ref={this.numberA}/>
          <input ref={this.numberB}/>
          <button onClick={this.handleClick}>+</button>
          <input ref={this.sum}/>
        </div>
    )
  }
}

ReactDOM.render(<Sum />, root);
