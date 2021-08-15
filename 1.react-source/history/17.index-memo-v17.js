// import React from 'react';
// import ReactDOM from 'react-dom';

import React from './source/react';
import ReactDOM from './source/react-dom';

function SubCounter(props) {
  console.log('SubCounter render');
  return (
      <div>
        SubCounter Number:{props.number}
      </div>
  );
}

const MemoSubCounter = React.memo(SubCounter);

console.log('MemoSubCounter', MemoSubCounter);

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      number: 0
    };
    this.numberRef = React.createRef();
  }

  handleClick = () => {
    const number = isNaN(this.numberRef.current.value) ? 0 : Number(this.numberRef.current.value);
    this.setState({
      number: this.state.number + number
    });
  }

  render() {
    console.log('Counter render');
    return (
        <div>
          <input ref={this.numberRef} />
          <button onClick={this.handleClick}>+</button>
          <MemoSubCounter number={this.state.number}/>
        </div>
    );
  }
}

ReactDOM.render(<Counter />, document.getElementById('root'))
