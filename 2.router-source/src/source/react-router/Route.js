import React from 'react';
import RouterContext from './RouterContext';
import matchPath from './matchPath';

export default class Route extends React.Component {
  static contextType = RouterContext;

  render() {
    const {history, location} = this.context;

    const {component: RouteComponent, computedMatcth} = this.props;

    // let match = location.pathname === path;
    const match = computedMatcth ? computedMatcth : matchPath(location.pathname, this.props);

    let renderElement = null;
    const routerProps = {history, location};
    if (match) {
      routerProps.match = match;
      renderElement = <RouteComponent {...routerProps}/>;
    }

    return renderElement;
  }
}
