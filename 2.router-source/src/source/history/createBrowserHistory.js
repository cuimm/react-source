function createBrowserHistory() {
  const globalHistory = window.history;
  let listeners = [];

  function go(n) {
    globalHistory.go(n);
  }

  function goForward() {
    globalHistory.goForward();
  }

  function goBack() {
    globalHistory.goBack();
  }

  /**
   * 监听函数
   * @param listener 监听对象
   * @returns {Function} 返回取消监听函数，如果取消会将监听函数从数组中删除
   */
  function listen(listener) {
    listeners.push(listener);
    return function () {
      listeners = listeners.filter(item => item !== listener);
    }
  }

  function setState(newState) {
    Object.assign(history, newState);
    history.length = globalHistory.length;
    listeners.forEach(listener => listener(history.location));
  }

  /**
   * 对标history路由api pushState
   * @param pathname
   * @param state
   */
  function push(pathname, state) {
    const action = 'PUSH';
    globalHistory.pushState(state, null, pathname);
    const location = {
      state,
      pathname
    };
    setState({action, location});
  }

  // 监听popstate事件
  window.addEventListener('popstate', event => {
    setState({
      action: 'POP',
      location: {
        pathname: window.location.pathname,
        state: event.state,
      }
    });
  });

  const history = {
    action: 'POP',
    go,
    goForward,
    goBack,
    push,
    listen,
    location: {pathname: window.location.pathname, state: globalHistory.state},
  };

  return history;
}

export default createBrowserHistory;
