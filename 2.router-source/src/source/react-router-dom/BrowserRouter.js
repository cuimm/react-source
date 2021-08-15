import React from 'react';
import {Router} from '../react-router'
import {createBrowserHistory} from 'history';

export default class BrowserRouter extends React.Component {
  constructor(props) {
    super(props);
    this.history = createBrowserHistory();
  }

  render() {
    return (
        <Router history={this.history}>
          {this.props.children}
        </Router>
    );
  }
}
