import { addEvent } from './event';
import { REACT_FORWARD_REF_TYPE, REACT_TEXT } from './constants';

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

  if (type && type.$$typeof === REACT_FORWARD_REF_TYPE) { /** 函数组件ref **/
    return mountForwardComponent(vdom);
  } else if (type === REACT_TEXT) { /** 文本节点 **/
    dom = document.createTextNode(props.content);
  } else if (typeof type === 'function') {
    if (type.isReactComponent) {
      return mountClassComponent(vdom); /** 类组件 **/
    }
    return mountFunctionComponent(vdom); /** 函数组件 **/
  } else {
    dom = document.createElement(type); /** 原生DOM类型 **/
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
      dom[key] = newProps[key];
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
  if (typeof type === 'function') {
    dom = findDOM(vdom.oldRenderVdom); // 函数组件和类组件: 递归查找oldRenderVdom
  } else {
    dom = vdom.dom;
  }
  return dom;
}

/**
 * 简略版 dom diff
 * @param parentNode
 * @param oldVdom
 * @param newVdom
 */
export function compareTwoVdom(parentNode, oldVdom, newVdom) {
  if (!oldVdom && !newVdom) {
    return;
  } else if (oldVdom && !newVdom) { // 老的没有 && 新的有 => 移除老DOM
    const currentDOM = findDOM(oldVdom);
    currentDOM.parentNode.removeChild(currentDOM);

    /** 生命周期 componentWillUnmount 即将卸载 **/
    if (oldVdom.classInstance && oldVdom.classInstance.componentWillUnmount) {
      oldVdom.classInstance.componentWillUnmount();
    }
  } else if (!oldVdom && newVdom) { // 老的没有 && 新的有 => 根据新的Vdom创建新的DOM并挂载到父DOM容器中
    const newDOM = createDOM(newVdom);
    parentNode.appendChild(newDOM); // TODO 此处可能是插入到当前位置 insertBefore

    /** 生命周期 componentDidMount 挂载完毕 **/
    if (newDOM.componentDidMount) {
        newDOM.componentDidMount();
    }
  } else if (oldVdom && newVdom && oldVdom.type !== newVdom.type) { // 新老都有 && type不同（无法复用）=> 删除老的，添加新的
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
  } else { // 老得有 && 新的也有 && 新老type一样 => 复用老节点，深度递归dom diff
    updateElement(oldVdom, newVdom);
  }
}

function updateElement(oldVdom, newVdom) {
  if (typeof oldVdom.type === 'string') { // 原生组件
    const currentDOM = newVdom.dom = findDOM(oldVdom);
    updateProps(currentDOM, oldVdom.props, newVdom.props); // 用新的属性更新DOM的属性
    updateChildren(currentDOM, oldVdom.props.children, newVdom.props.children);
  }
}

function updateChildren(parentDOM, oldVChildren, newVChildren) {
  oldVChildren = Array.isArray(oldVChildren) ? oldVChildren : [oldVChildren];
  newVChildren = Array.isArray(newVChildren) ? newVChildren : [newVChildren];
  const maxLength = Math.max(oldVChildren.length, newVChildren.length);
  for (let i = 0; i < maxLength; i++) {
    compareTwoVdom(parentDOM, oldVChildren[i], newVChildren[i]);
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