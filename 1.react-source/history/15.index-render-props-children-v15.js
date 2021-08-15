// import React from 'react';
// import ReactDOM from 'react-dom';

import React from './source/react';
import ReactDOM from './source/react-dom';

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
        <div onMouseMove={this.handleMouseMove}>
          {this.props.children(this.state)}
        </div>
    );
  }
}

ReactDOM.render(
    <MouseTicker>
      {
        props => {
          return (
              <div>
                <h1>移动鼠标</h1>
                <h2>当前鼠标位置: [{props.x}, {props.y}]</h2>
              </div>
          )
        }
      }
    </MouseTicker>,
    document.getElementById('root')
);

/*
 {
    type: MouseTicker,
    props: {
      children: props => {...}
    },
 }
 */
