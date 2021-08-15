// import React from 'react';
// import ReactDOM from 'react-dom';

import React from './source/react';
import ReactDOM from './source/react-dom';

const CounterContext = React.createContext();

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
  const {state, dispatch} = React.useContext(CounterContext);
  return (
      <div>
        <p>{state.number}</p>
        <button onClick={() => dispatch({type: 'ADD'})}>+</button>
        <button onClick={() => dispatch({type: 'MINUS'})}>-</button>
      </div>
  );
}

function App() {
  const [state, dispatch] = React.useReducer(reducer, {number: 0});
  return (
      <div>
        <CounterContext.Provider value={{state, dispatch}}>
          <Counter/>
        </CounterContext.Provider>
      </div>
  );
}


ReactDOM.render(<App/>, document.getElementById('root'))
