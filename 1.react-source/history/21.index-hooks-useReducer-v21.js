// import React from 'react';
// import ReactDOM from 'react-dom';

import React from './source/react';
import ReactDOM from './source/react-dom';

function reducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return {number: state.number + 1};
    case 'MINUS':
      return {number: state.number - 1};
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = React.useReducer(null, {number: 0});
  console.log(state, dispatch);
  return (
      <div>
        <p>{state.number}</p>
        <button onClick={() => dispatch({type: 'ADD'})}>+</button>
        <button onClick={() => dispatch({type: 'MINUS'})}>-</button>
      </div>
  );
}


ReactDOM.render(<Counter/>, document.getElementById('root'))
