// import React from 'react';
// import ReactDOM from 'react-dom';

import React from './source/react';
import ReactDOM from './source/react-dom';

const root = document.getElementById('root');
function FunctionComponent(props) {
  return (
      <div id='container' style={{backgroundColor: 'red'}}>
        <span>hello</span>
        {props.name}
      </div>
  )
}

const element = <FunctionComponent name='cuimm' />
console.log('element', element);

ReactDOM.render(element, root);
