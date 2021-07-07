import {REACT_TEXT} from './constants';

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
    // 文本节点
    dom = document.createTextNode(props.content);
  } else if (typeof type === 'function') {
    return mountFunctionComponent(vdom);
  } else {
    // 原生DOM类型
    dom = document.createElement(type);
  }
  if (props) {
    updateProps(dom, {}, props);
    if (typeof props.children === 'object' && props.children.type) {
      render(props.children, dom);
    } else if (Array.isArray(props.children)) {
      reconcileChildren(props.children, dom);
    }
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
    } else {
      dom[key] = newProps[key];
    }
  }
}

/**
 * 递归渲染字节点
 * @param children
 * @param parentDOM
 */
function reconcileChildren(children, parentDOM) {
  for (let index = 0; index < children.length; index++) {
    render(children[index], parentDOM);
  }
}

const reactDOM = {
  render,
};

export default reactDOM;
