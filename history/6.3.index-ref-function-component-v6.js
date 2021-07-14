// import React from 'react';
// import ReactDOM from 'react-dom';

import React from './source/react';
import ReactDOM from './source/react-dom';

const root = document.getElementById('root');

function TextInput(props, ref) {
  return <input ref={ref}/>
}

const ForwardedTextInput = React.forwardRef(TextInput); // { $$typeof: 'react.forward_ref', render: functionComponent }

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.textInputRef = React.createRef();
  }

  getFormFocus = () => {
    this.textInputRef.current.focus();
  };

  render() {
    console.log(<ForwardedTextInput ref={this.textInputRef}/>);
    /*
    {
      type: { $$typeof: 'react.forward_ref', render: TextInput }
    }
    * */
    return (
        <div>
          <ForwardedTextInput ref={this.textInputRef}/>
          <button onClick={this.getFormFocus}>获取焦点</button>
        </div>
    )
  }
}

ReactDOM.render(<Form/>, root);
