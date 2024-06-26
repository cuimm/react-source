import {addEvent} from './event';
import {REACT_CONTEXT, REACT_FORWARD_REF_TYPE, REACT_MEMO, REACT_PROVIDER, REACT_TEXT} from './constants';

let hookIndex = 0;  // 当前执行的hook的索引
const hookState = []; // 存放所有的状态
let scheduleUpdate;   // 调度更新方法

/**
 * 将虚拟节点转化为真实DOM并插入容器
 * @param vdom 虚拟节点
 * @param container 根容器
 */
function render(vdom, container) {

  mount(vdom, container);

  scheduleUpdate = () => {
    hookIndex = 0;  // 再次调用更新方法的时候，将hookIndex重置为0
    compareTwoVdom(container, vdom, vdom); // vdom不是指向当前的更新，而是指向根元素
  };

}

/**
 * 将虚拟节点转化为真实DOM并插入容器
 * @param vdom
 * @param container
 */
function mount(vdom, container) {
  if (!vdom) return;
  const newDOM = createDOM(vdom);
  container.appendChild(newDOM);

  /** 生命周期 componentDidMount 挂载完毕 **/
  if (newDOM.componentDidMount) {
    newDOM.componentDidMount();
  }
}

/**
 * react hooks useState
 * useState可以我们在函数组件使用状态
 * @param initialState 初始状态
 * @returns {*[]}
 */
function useState(initialState) {
  if (hookState[hookIndex] === undefined) {
    hookState[hookIndex] = initialState;
  }
  const currentIndex = hookIndex;
  function setState(newState) {
    if (typeof newState === 'function') {
      newState = newState(hookState[currentIndex]);
    }
    hookState[currentIndex] = newState;
    scheduleUpdate();
  }
  return [hookState[hookIndex++], setState];
}

/**
 * useState是useReducer的一个语法糖
 * @param initialState
 * @returns {*}
 */
/*
function useState(initialState) {
  return useReducer(null, initialState);
}
*/

/**
 * useState的替代方案
 * 在某些场景下，useReducer比useState更适用，例如state逻辑较复杂且包含多个子值，或者下一个state依赖于之前的state等
 * @param reducer
 * @param initialState
 * @returns {*[]}
 */
function useReducer(reducer, initialState) {
  if (hookState[hookIndex] === undefined) {
    hookState[hookIndex] = initialState;
  }
  let currentIndex = hookIndex;

  function dispatch(action) {
    hookState[currentIndex] = reducer ? reducer(hookState[currentIndex], action) : action;
    scheduleUpdate();
  }
  return [hookState[hookIndex++], dispatch];
}

function useRef() {
  if (hookState[hookIndex]) {
    return hookState[hookIndex++];
  } else {
    hookState[hookIndex] = {
      current: null,
    };
    return hookState[hookIndex++];
  }
}

/**
 * 在函数组件主体内（这里指在 React 渲染阶段）改变 DOM、添加订阅、设置定时器、记录日志以及执行其他包含副作用的操作都是不被允许的，因为这可能会产生莫名其妙的 bug 并破坏 UI 的一致性。
 * 使用 useEffect 完成副作用操作。
 * 赋值给 useEffect 的函数会在组件渲染到屏幕之后执行。
 * 给函数组件提供了操作副作用的能力。
 * @param callback
 * @param deps
 */
function useEffect(callback, deps) {
  if (hookState[hookIndex]) {
    const [destroy, lastDeps] = hookState[hookIndex];
    const everySame = deps.every((dep, index) => dep === lastDeps[index]);
    if (everySame) {
      hookIndex++;
    } else {
      destroy && destroy(); // 先执行销毁函数
      setTimeout(() => {
        const destroy = callback();
        hookState[hookIndex++] = [destroy, deps];
      });
    }
  } else {
    setTimeout(() => {
      const destroy = callback();
      hookState[hookIndex++] = [destroy, deps];
    });
  }
}

/**
 * 其函数签名与 useEffect 相同，但它会在所有的 DOM 变更之后同步调用 effect
 * useEffect不会阻塞浏览器渲染，而 useLayoutEffect 会阻塞浏览器渲染
 * useEffect会在浏览器渲染结束后执行,useLayoutEffect 则是在 DOM 更新完成后,浏览器绘制之前执行
 * @param callback
 * @param deps
 */
function useLayoutEffect(callback, deps) {
  if (hookState[hookIndex]) {
    const [destroy, lastDeps] = hookState[hookIndex];
    const everySame = deps.every((dep, index) => dep === lastDeps[index]);
    if (everySame) {
      hookIndex++;
    } else {
      destroy && destroy();
      queueMicrotask(() => {
        const destroy = callback();
        hookState[hookIndex++] = [destroy, deps];
      });
    }
  } else {
    queueMicrotask(() => {
      const destroy = callback();
      hookState[hookIndex++] = [destroy, deps];
    });
  }
}

/**
 * react hooks useMemo
 * useMemo (备忘录) 可以实现缓存，可以让对象或者函数在依赖项不变的前提下保持不变
 * useMemo 第一次会将factory计算出的结果赋值给目标变量，dom diff进行后面渲染计算的时候，会比较依赖项是否变化，如果依赖项值没有改变不会重新计算目标变量，如果依赖项改变则会重新计算目标变量。
 * @param factory 工厂函数
 * @param deps 依赖项
 * @returns {*}
 */
function useMemo(factory, deps) {
  if (hookState[hookIndex] !== undefined) {
    const [lastMemo, lastDeps] = hookState[hookIndex];
    const everySame = deps.every((item, index) => item === lastDeps[index]);
    if (everySame) {
      hookIndex++;
      return lastMemo;
    } else {
      const newMemo = factory();
      hookState[hookIndex++] = [newMemo, deps];
      return newMemo;
    }
  } else {
    const newMemo = factory();
    hookState[hookIndex++] = [newMemo, deps];
    return newMemo;
  }
}

/**
 * react hooks useCallback
 * useCallback 可以实现缓存，可以让回调函数在依赖项不变的前提下保持不变
 * callback通过prop传递给子组件，如果依赖项不变，为了减少不必要的更新，返回上次的callback
 * @param callback
 * @param deps 依赖项
 */
function useCallback(callback, deps) {
  if (hookState[hookIndex] !== undefined) {
    const [lastCallback, lastDeps] = hookState[hookIndex];
    const everySame = lastDeps.every((item, index) => item === deps[index]);
    if (everySame) {
      hookIndex++;
      return lastCallback;
    } else {
      hookState[hookIndex++] = [callback, deps];
      return callback;
    }
  } else {
    hookState[hookIndex++] = [callback, deps];
    return callback;
  }
}

/**
 * 创建真实节点
 * @param vdom {type: 'div', {id: 'root', children: []}}
 * @returns {HTMLElement | Text}
 */
function createDOM(vdom) {
  const {type, props, ref} = vdom;
  // 真实dom节点
  let dom;

  if (type && type.$$typeof === REACT_MEMO) { /** memo **/
  return mountMemoComponent(vdom);
  } if (type && type.$$typeof === REACT_PROVIDER) { /** Context.Provider **/
    return mountProviderComponent(vdom);
  } else if (type && type.$$typeof === REACT_CONTEXT) { /** Context.Consumer **/
    return mountContextComponent(vdom);
  } else if (type && type.$$typeof === REACT_FORWARD_REF_TYPE) { /** 函数组件ref **/
    return mountForwardComponent(vdom);
  } else if (type === REACT_TEXT) { /** 文本节点 **/
    dom = document.createTextNode(props.content);
  } else if (typeof type === 'function') {
    if (type.isReactComponent) {
      return mountClassComponent(vdom); /** 类组件 **/
    }
    return mountFunctionComponent(vdom); /** 函数组件 **/
  } else if (typeof type === 'string') {
    dom = document.createElement(type); /** 原生DOM类型 **/
  } else {
    throw new Error('无法处理的元素类型' + type);
  }

  if (props) {
    updateProps(dom, {}, props);
    if (typeof props.children === 'object' && props.children.type) {
      render(props.children, dom);
    } else if (Array.isArray(props.children)) {
      reconcileChildren(props.children, dom);
    }
  }

  // 将创建出来的真实DOM挂载到虚拟dom的dom属性上
  vdom.dom = dom;

  if (ref) {
    ref.current = dom; // 让ref的current指向真实的DOM实例
  }

  return dom;
}

/**
 * 挂载函数组件
 * @param vdom
 * @returns {HTMLElement|Text}
 */
function mountFunctionComponent(vdom) {
  const {type, props} = vdom;
  const renderVdom = type(props);
  vdom.oldRenderVdom = renderVdom; // 函数组件（oldRenderVdom）：挂载计算出来的虚拟dom
  return createDOM(renderVdom);
}

/**
 * 挂载类组件
 * @param vdom
 * @returns {HTMLElement|Text}
 */
function mountClassComponent(vdom) {
  const {type, props, ref} = vdom;
  const defaultProps = type.defaultProps || {};
  const classInstance = new type({...defaultProps, ...props});

  if (type.contextType) {
    classInstance.context = type.contextType._value; // Context上下文
  }

  vdom.classInstance = classInstance; // 将组件实例绑定在vdom上

  /** 生命周期: componentWillMount 即将挂载 **/
  if (classInstance.componentWillMount) {
    classInstance.componentWillMount();
  }

  const renderVdom = classInstance.render();

  classInstance.oldRenderVdom = vdom.oldRenderVdom = renderVdom; // 类组件（oldRenderVdom）：将计算出来的虚拟DOM挂载到类的实例上

  if (ref) {
    ref.current = classInstance; // ref.current指向类组件的实例
  }

  const dom = createDOM(renderVdom);

  /** 生命周期 componentDidMount 挂载完毕 **/
  if (classInstance.componentDidMount) {
      dom.componentDidMount = classInstance.componentDidMount.bind(classInstance); // 将componentDidMount暂存在dom上
  }

  return dom;
}

/**
 * 挂载函数组件ref
 * @param vdom
 */
function mountForwardComponent(vdom) {
  const {type, props, ref} = vdom;
  const renderVdom = type.render(props, ref);
  vdom.oldRenderVdom = renderVdom;
  return createDOM(renderVdom);
}

/**
 * 挂载Context.Provider
 * @param vdom
 */
function mountProviderComponent(vdom) {
  const {type, props} = vdom; // type = {$$typeof: REACT_PROVIDER, _context: context }
  type._context._currentValue = props.value; // 在渲染Provider组件的时候，拿到属性重的value，赋值给context._currentValue
  const renderVdom = props.children; // Context.Provider 渲染出的vdom是字节点
  vdom.oldRenderVdom = renderVdom;
  return createDOM(renderVdom);
}

/**
 * 挂载Context.Consumer
 * @param vdom
 */
function mountContextComponent(vdom) {
  const {type, props} = vdom;
  const renderVdom = props.children(type._context._currentValue); // Consumer组件的字节点是一个函数，参数为父节点提供的value
  vdom.oldRenderVdom = renderVdom;
  return createDOM(renderVdom);
}

/**
 * 挂载memo组件
 * @param vdom
 */
function mountMemoComponent(vdom) {
  const {type, props} = vdom;
  const renderVdom = type.type(props);
  vdom.prevProps = props; // 记录老属性值，用于下次更新
  vdom.oldRenderVdom = renderVdom;
  return createDOM(renderVdom);
}

/**
 * 根据虚拟DOM中的属性更新真实DOM属性
 * @param dom
 * @param oldProps
 * @param newProps
 */
function updateProps(dom, oldProps, newProps) {
  for (let key in newProps) {
    if (key === 'children') {
      continue;
    }
    if (key === 'style') {
      const styleProps = newProps[key];
      for (let attr in styleProps) {
        dom.style[attr] = styleProps[attr];
      }
    } else if (key.startsWith('on')) {
      // dom[key.toLocaleLowerCase()] = newProps[key]; //=> dom.onclick = handleClick
      addEvent(dom, key.toLocaleLowerCase(), newProps[key]); // 事件委托
    } else {
      if (newProps[key]) {
        dom[key] = newProps[key];
      }
    }
  }
}

/**
 * 递归渲染子节点
 * @param children
 * @param parentDOM
 */
function reconcileChildren(children, parentDOM) {
  for (let index = 0; index < children.length; index++) {
    render(children[index], parentDOM);
  }
}

/**
 * 根据虚拟dom查找真实DOM
 * 函数组件和类组件：会挂载oldRenderVdom
 * 普通原生组件：会挂载真实dom
 * @param vdom
 */
export function findDOM(vdom) {
  const {type} = vdom;
  let dom;
  if (typeof type === 'string' || type === REACT_TEXT) { // 原生组件
    dom = vdom.dom
  } else {
    dom = findDOM(vdom.oldRenderVdom); // 函数组件、类组件、Provider、Consumer组件等: 递归查找oldRenderVdom
  }
  return dom;
}

/**
 * 简略版 dom diff
 * @param parentNode
 * @param oldVdom
 * @param newVdom
 * @param nextDOM
 */
export function compareTwoVdom(parentNode, oldVdom, newVdom, nextDOM) {
  if (!oldVdom && !newVdom) {
  } else if (oldVdom && !newVdom) { // 1. 老的没有 && 新的有 => 移除老DOM
    const currentDOM = findDOM(oldVdom);
    currentDOM.parentNode.removeChild(currentDOM);

    /** 生命周期 componentWillUnmount 即将卸载 **/
    if (oldVdom.classInstance && oldVdom.classInstance.componentWillUnmount) {
      oldVdom.classInstance.componentWillUnmount();
    }
  } else if (!oldVdom && newVdom) { // 2. 老的没有 && 新的有 => 根据新的Vdom创建新的DOM并挂载到父DOM容器中
    const newDOM = createDOM(newVdom);

    if (nextDOM) {
      parentNode.insertBefore(newDOM, nextDOM);
    } else {
      parentNode.appendChild(newDOM);
    }

    /** 生命周期 componentDidMount 挂载完毕 **/
    if (newDOM.componentDidMount) {
        newDOM.componentDidMount();
    }
  } else if (oldVdom && newVdom && oldVdom.type !== newVdom.type) { // 3. 新老都有 && type不同（无法复用）=> 删除老的，添加新的
    const oldDOM = findDOM(oldVdom); // 获取老的DOM
    const newDOM = createDOM(newVdom); // 创建新的DOM
    oldDOM.parentNode.replaceChild(newDOM, oldDOM);

    /** 生命周期 componentWillUnmount 即将卸载 **/
    if (oldDOM.classInstance && oldDOM.classInstance.componentWillUnmount) {
      oldDOM.classInstance.componentWillUnmount();
    }
    /** 生命周期 componentDidMount 挂载完毕 **/
    if (newDOM.componentDidMount) {
      newDOM.componentDidMount();
    }
  } else { // 4. 老得有 && 新的也有 && 新老type一样 => 复用老节点，深度递归dom diff
    updateElement(oldVdom, newVdom);
  }
}

/**
 * 新老vdom的类型type一样时用新的vdom更新老得vdom
 * @param oldVdom
 * @param newVdom
 */
function updateElement(oldVdom, newVdom) {
  if (oldVdom.type && oldVdom.type.$$typeof === REACT_MEMO) {
    updateMemoComponent(oldVdom, newVdom);
  } if (oldVdom.type && oldVdom.type.$$typeof === REACT_PROVIDER) {
    updateProviderComponent(oldVdom, newVdom);
  } else if (oldVdom.type && oldVdom.type.$$typeof === REACT_CONTEXT) {
    updateContextComponent(oldVdom, newVdom);
  } else if (oldVdom.type === REACT_TEXT && newVdom.type === REACT_TEXT) { // 文本节点
    const currentDOM = newVdom.dom = findDOM(oldVdom); // 复用节点（只有文本节点和原生节点的虚拟dom上会挂载真实DOM）
    if (oldVdom.props.content !== newVdom.props.content) {
      currentDOM.textContent = newVdom.props.content;
    }
  } else if (typeof oldVdom.type === 'string') { // 原生组件
    const currentDOM = newVdom.dom = findDOM(oldVdom); // 复用节点
    updateProps(currentDOM, oldVdom.props, newVdom.props); // 用新的属性更新DOM的属性
    updateChildren(currentDOM, oldVdom.props.children, newVdom.props.children);
  } else if (typeof oldVdom.type === 'function') {
    if (oldVdom.type.isReactComponent) {
      updateClassComponent(oldVdom, newVdom); // 类组件
    } else {
      updateFunctionComponent(oldVdom, newVdom); // 函数组件
    }
  }
}

/**
 * 更新类组件
 * @param oldVdom
 * @param newVdom
 */
function updateClassComponent(oldVdom, newVdom) {
  const classInstance = newVdom.classInstance = oldVdom.classInstance;
  newVdom.oldRenderVdom = oldVdom.oldRenderVdom;

  /** 生命周期 componentWillReceiveProps 接收属性 **/
  if (classInstance.componentWillReceiveProps) {
    classInstance.componentWillReceiveProps();
  }
  classInstance.updater.emitUpdate(newVdom.props); // 调用emitUpdate方法，触发类组件更新
}

/**
 * 更新函数组件
 * @param oldVdom
 * @param newVdom
 */
function updateFunctionComponent(oldVdom, newVdom) {
  const currentDOM = findDOM(oldVdom);
  const {type, props} = newVdom;
  const renderVdom = type(props);
  compareTwoVdom(currentDOM.parentNode, oldVdom.oldRenderVdom, renderVdom);
  newVdom.oldRenderVdom = renderVdom;
}

/**
 * 更新Provider组件
 * @param oldVdom
 * @param newVdom
 */
function updateProviderComponent(oldVdom, newVdom) {
  const parentDOM = findDOM(oldVdom).parentNode;
  const {type, props} = newVdom;
  type._context._currentValue = props.value; // 重新给Provider的value赋值
  const renderVdom = props.children; // 获取新的vdom
  compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, renderVdom);
  newVdom.oldRenderVdom = renderVdom;
}

/**
 * 更新Context组件
 * @param oldVdom
 * @param newVdom
 */
function updateContextComponent(oldVdom, newVdom) {
  const parentDOM = findDOM(oldVdom).parentNode;
  const {type, props} = newVdom;
  const renderVdom = props.children(type._context._currentValue);
  compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, renderVdom);
  newVdom.oldRenderVdom = renderVdom;
}

/**
 * 更新memo组件
 * @param oldVdom
 * @param newVdom
 */
function updateMemoComponent(oldVdom, newVdom) {
  const {type} = oldVdom;
  if (type.compare(oldVdom.prevProps, newVdom.props)) {
    newVdom.oldRenderVdom = oldVdom.oldRenderVdom;
    newVdom.prevProps = newVdom.props;
  } else {
    const {type, props} = newVdom;
    const parentDOM = findDOM(oldVdom).parentNode;
    const renderVdom = type.type(props);
    compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, renderVdom);
    newVdom.oldRenderVdom = renderVdom;
    newVdom.prevProps = props; // 记录老的属性
  }
}

function updateChildren(parentDOM, oldVChildren, newVChildren) {
  oldVChildren = Array.isArray(oldVChildren) ? oldVChildren : [oldVChildren];
  newVChildren = Array.isArray(newVChildren) ? newVChildren : [newVChildren];
  const maxLength = Math.max(oldVChildren.length, newVChildren.length);
  for (let i = 0; i < maxLength; i++) {
    // 找到当前虚拟dom节点之后的最近的一个真实DOM节点
    const nextVNode = oldVChildren.find((item, index) => {
      return item && (index > i) && findDOM(item);
    });
    compareTwoVdom(parentDOM, oldVChildren[i], newVChildren[i], nextVNode && findDOM(nextVNode));
  }
}

const reactDOM = {
  render,
};

export default reactDOM;
export {
  useState,
  useMemo,
  useCallback,
  useReducer,
  useRef,
  useEffect,
  useLayoutEffect,
}

/*
export function compareTwoVdom(parentNode, oldVdom, newVdom) {
  let oldDOM = findDOM(oldVdom);
  const newDOM = createDOM(newVdom);
  parentNode.replaceChild(newDOM, oldDOM);
}
* */
