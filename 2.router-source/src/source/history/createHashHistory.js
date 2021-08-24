function createHashHistory() {
  let stack = []; // 模拟历史栈，内部存放每一次的location
  let index = -1; // 模拟路由当前索引
  let listeners = []; // 监听函数的数组
  let action = 'POP'; // 动作
  let state; // 当前状态（{pathname, state}）

  function go(n) {
    action = 'POP';
    index += n;
    if (index < 0) {
      index = 0
    } else if (index >= stack.length) {
      index = stack.length - 1;
    }
    let nextLocation = stack[index];
    state = nextLocation.state;
    window.location.hash = nextLocation.pathname; // 用新的路径改变当前的hash值
  }

  function goForward() {
    go(1);
  }

  function goBack() {
    go(-1);
  }

  function push(path, nextState) {
    action = 'PUSH';
    state = nextState;
    window.location.hash = path;
  }

  function listen(listener) {
    listeners.push(listener);
    return function () {
      listeners.filter(item => item !== listener);
    }
  }

  function handleHashChange() {
    const pathname = window.location.hash.slice(1);
    const location = {pathname, state};
    Object.assign(history, {action, location}); // 改变history

    // go方法是在历史条目中前进后退，条目数不会改变.
    // 但当执行push方法的时候，会改变索引增加新的条目.
    if (action === 'PUSH') {
      stack[++index] = history.location;
    }

    listeners.forEach(listener => listener(history.location)); // 执行监听函数
  }

  window.addEventListener('hashchange', handleHashChange);

  const history = {
    action,
    go,
    goForward,
    goBack,
    push,
    listen,
    location: {pathname: window.location.hash.slice(1), state: undefined},
  };

  if (window.location.hash) {
    action = 'PUSH';
    handleHashChange();
  } else {
    window.location.hash = '/';
  }

  return history;
}

export default createHashHistory;
