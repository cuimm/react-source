// import React from 'react';
// import ReactDOM from 'react-dom';

import React from './source/react';
import ReactDOM from './source/react-dom';

const root = document.getElementById('root');

// 第一次点击"+",打印：0 0 2 3
class Counter extends React.Component {
  state = {number: 0};
  handleClick = () => {
    this.setState({number: this.state.number + 1});
    console.log(this.state.number);
    this.setState({number: this.state.number + 1});
    console.log(this.state.number);

    // 宏任务。执行该宏任务、或者微任务的时候，updateQueue.isBatchingUpdate已经是false了
    setTimeout(() => {
      this.setState({number: this.state.number + 1});
      console.log(this.state.number);
      this.setState({number: this.state.number + 1});
      console.log(this.state.number);
    });
  };

  render() {
    return (
        <div>
          <p>{this.state.number}</p>
          <button onClick={this.handleClick}>+</button>
        </div>
    )
  };
}

const element = React.createElement(Counter);

console.log('element', element);

ReactDOM.render(element, root);
