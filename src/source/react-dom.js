import {REACT_TEXT} from './constants';

/**
 * 给根容器挂载节点
 * @param vdom 虚拟节点
 * @param container 根容器
 */
function render(vdom, container) {
  const newDOM = createDOM(vdom);
  container.appendChild(newDOM);
}

/**
 * 创建真实节点
 * @param vdom
 * @returns {HTMLElement | Text}
 */
function createDOM(vdom) {
  const {type, props} = vdom;
  // 真实dom节点
  let dom;

  if (type === REACT_TEXT) {
    // 文本节点
    dom = document.createTextNode(props.content);
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
      const style = newProps[key];
      for (let attr in style) {
        dom.style[attr] = style[attr];
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
