import React from 'react';
import RouterContext from './RouterContext';

class Router extends React.Component {
  static computeRootMatch(pathname) {
    return {
      path: '/',
      url: '/',
      params: {},
      isExact: pathname === '/',
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      location: props.history.location,
    };

    // 监听路由变化：当路径发生变化的时候执行回调，并传入最新路径。
    this.unlistion = props.history.listen(location => {
      this.setState({location}); // 状态改变引起组件刷新
    });
  }

  componentWillUnmount() {
    this.unlistion(); // 组件卸载时将路由监听销毁
  }

  render() {
    const value = {
      history: this.props.history,
      location: this.state.location,
      match: Router.computeRootMatch(this.state.location.pathname),
    };
    return (
        <RouterContext.Provider value={value}>
          {this.props.children}
        </RouterContext.Provider>
    );
  }
}

export default Router;
