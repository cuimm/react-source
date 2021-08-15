import React from 'react';
import RouterContext from './RouterContext';

export default class Route extends React.Component {
  static contextType = RouterContext;

  render() {
    const {history, location} = this.context;

    const {path, component: RouteComponent} = this.props;

    let match = location.pathname === path;
    let renderElement = null;
    const routerProps = {history, location};
    if (match) {
      renderElement = <RouteComponent {...routerProps}/>;
    }

    return renderElement;
  }
}
