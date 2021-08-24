import React from 'react';
import ReactDOM from 'react-dom';
// import {HashRouter as Router, Route} from 'react-router-dom';
import {BrowserRouter as Router, Route} from './source/react-router-dom';

import Home from './components/Home';
import User from './components/User';
import Profile from './components/Profile';

ReactDOM.render(
    (
        <div>
          <Router>
            <>
              <Route path="/" component={Home}/>
              <Route path="/user" component={User}/>
              <Route path="/profile" component={Profile}/>
            </>
          </Router>

          <a href="#/">home</a>
          <a href="#/user">user</a>
          <a href="#/profile">profile</a>
        </div>
    ),
    document.getElementById('root')
);
