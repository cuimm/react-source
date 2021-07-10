// import React from 'react';
// import ReactDOM from 'react-dom';

import React from './source/react';
import ReactDOM from './source/react-dom';

const root = document.getElementById('root');

class TextInput extends React.Component {
  constructor(props) {
    super(props);
    this.textInputRef = React.createRef();
  }

  getTextInputFocus = () => {
    this.textInputRef.current.focus();
  };

  render() {
    return <input ref={this.textInputRef}/>
  }
}

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.textInputRef = React.createRef();
  }
  getFormFocus() {
    this.textInputRef.current.getTextInputFocus(); // this.textInputRef.current指向类组件TextInput的实例
  }
  render() {
    return (
        <div>
          <TextInput ref={this.textInputRef}/>
          <button onClick={this.getFormFocus.bind(this)}>获取焦点</button>
        </div>
    )
  }
}

ReactDOM.render(<Form />, root);
