import { addEvent } from './event';
import {REACT_CONTEXT, REACT_FORWARD_REF_TYPE, REACT_PROVIDER, REACT_TEXT} from './constants';

/**
 * 将虚拟节点转化为真实DOM并插入容器
 * @param vdom 虚拟节点
 * @param container 根容器
 */
function render(vdom, container) {
  if (!vdom) return;
  const newDOM = createDOM(vdom);
  container.appendChild(newDOM);

  /** 生命周期 componentDidMount 挂载完毕 **/
  if (newDOM.componentDidMount) {
      newDOM.componentDidMount();
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

  if (type && type.$$typeof === REACT_PROVIDER) { /** Context.Provider **/
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
  if (oldVdom.type && oldVdom.type.$$typeof === REACT_PROVIDER) {
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

/*
export function compareTwoVdom(parentNode, oldVdom, newVdom) {
  let oldDOM = findDOM(oldVdom);
  const newDOM = createDOM(newVdom);
  parentNode.replaceChild(newDOM, oldDOM);
}
* */
