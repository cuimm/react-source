// import React from 'react';
// import ReactDOM from 'react-dom';

import React from './source/react';
import ReactDOM from './source/react-dom';


/**
 * 原生实现
 */
class MouseTicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
    };
  }

  handleMouseMove = (event) => {
    this.setState({
      x: event.clientX,
      y: event.clientY,
    });
  }

  render() {
    return (
        <div
            onMouseMove={this.handleMouseMove}
            style={{width: '100vw', height: '100vh'}}
        >
          <h1>移动鼠标</h1>
          <h2>当前鼠标位置: [{this.state.x},{this.state.y}]</h2>
        </div>
    );
  }
}

ReactDOM.render(<MouseTicker />, document.getElementById('root'));
