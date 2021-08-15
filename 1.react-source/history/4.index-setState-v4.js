// import React from 'react';
// import ReactDOM from 'react-dom';

import React from './source/react';
import ReactDOM from './source/react-dom';

const root = document.getElementById('root');

class Counter extends React.Component {

  /*
  这种写法，经过babel转译为：
    _defineProperty(this, "state", {
      number: 0
    });
  * */
  state = {number: 0};

  handleClick = (event) => {
    /*
    React为了性能考虑，会将多个setState的调用合并为一个来执行，也就是说，当执行setState的时候，state中的数据并不会马上更新
    * */
    this.setState({
      number: this.state.number + 1,
    }, () => {
      console.log('callback1', this.state.number);
    });

    this.setState({
      number: this.state.number + 1,
    }, () => {
      console.log('callback2', this.state.number);
    });

    Promise.resolve().then(() => {
      this.setState({
        number: this.state.number + 1,
      }, () => {
        console.log('callback3', this.state.number);
      });
      this.setState({
        number: this.state.number + 1,
      }, () => {
        console.log('callback4', this.state.number);
      });
    });

    setTimeout(() => {
      this.setState({
        number: this.state.number + 1,
      }, () => {
        console.log('callback5', this.state.number);
      });
    });
  };

  render() {
    return (
        <div>
          {this.props.name}
          <p>{this.state.number}</p>
          <button onClick={this.handleClick}>+</button>
        </div>
    )
  }
}

const element = <Counter name='cuimm'/>
console.log('element', element);
/*
{
  type: ClassComponent,
  props: {
    name: 'cuimm'
  }
}
* */

ReactDOM.render(element, root);
