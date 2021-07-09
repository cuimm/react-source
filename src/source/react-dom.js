import {REACT_TEXT} from './constants';
import {addEvent} from './event';

/**
 * 将虚拟节点转化为真实DOM并插入容器
 * @param vdom 虚拟节点
 * @param container 根容器
 */
function render(vdom, container) {
  const newDOM = createDOM(vdom);
  container.appendChild(newDOM);
}

/**
 * 创建真实节点
 * @param vdom {type: 'div', {id: 'root', children: []}}
 * @returns {HTMLElement | Text}
 */
function createDOM(vdom) {
  const {type, props} = vdom;
  // 真实dom节点
  let dom;

  if (type === REACT_TEXT) {
    dom = document.createTextNode(props.content); /** 文本节点 **/
  } else if (typeof type === 'function') {
    if (type.isReactComponent) {
      return mountClassComponent(vdom);
    }
    return mountFunctionComponent(vdom);
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
 * 挂在类组件
 * @param vdom
 * @returns {HTMLElement|Text}
 */
function mountClassComponent(vdom) {
  const {type, props} = vdom;
  const classInstance = new type(props);
  const renderVdom = classInstance.render();
  classInstance.oldRenderVdom = vdom.oldRenderVdom = renderVdom; // 类组件（oldRenderVdom）：将计算出来的虚拟DOM挂载到类的实例上
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

// TODO dom diff...
export function compareTwoVdom(parentNode, oldVdom, newVdom) {
  let oldDOM = findDOM(oldVdom);
  const newDOM = createDOM(newVdom);
  parentNode.replaceChild(newDOM, oldDOM);
}

const reactDOM = {
  render,
};

export default reactDOM;
