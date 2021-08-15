// import React from 'react';
// import ReactDOM from 'react-dom';

import React from './source/react';
import ReactDOM from './source/react-dom';

const root = document.getElementById('root');

class ClassComponent extends React.Component {
  render() {
    return (
        <div id='container'>
          <p>hello</p>
          {this.props.name}
        </div>
    )
  }
}

const element = <ClassComponent name='cuimm' />
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
