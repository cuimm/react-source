// import React from 'react';
// import ReactDOM from 'react-dom';

import React from './source/react';
import ReactDOM from './source/react-dom';

const root = document.getElementById('root');
const element = (
    <div id='div' className='container' style={{backgroundColor:'green',color:'red'}}>
      Hello
      <span>React</span>
    </div>
);

console.log('element', element);

ReactDOM.render(element, root);
