// import React from 'react';
// import ReactDOM from 'react-dom';

import React from './source/react';
import ReactDOM from './source/react-dom';

const withTicker = OldComponent => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        x: 0,
        y: 0,
      };
    }

    handleMouseMove = event => {
      this.setState({
        x: event.clientX,
        y: event.clientY,
      });
    }

    render() {
      return (
          <div onMouseMove={this.handleMouseMove}>
            <OldComponent {...this.state}/>
          </div>
      );
    }
  }
}

function MouseTicker(props) {
  return (
      <div>
        <h1>移动鼠标</h1>
        <h2>当前鼠标位置: [{props.x}, {props.y}]</h2>
      </div>
  );
}

const HigherMouseTicker = withTicker(MouseTicker);

ReactDOM.render(<HigherMouseTicker/>, document.getElementById('root'))
