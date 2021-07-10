import { wrapToVdom } from './utils';
import { Component } from './Component';

/**
 * @param type 元素的类型
 * @param config 配置对象
 * @param children 儿子或儿子们。children可能是一个字符串、数字、null、undefined、数组
 */
function createElement(type, props, children) {
  let key; // key 用来区分同一个父亲不同儿子的
  let ref; // ref 用来获取虚拟dom实例的，用于dom diff

  if (props) {
    delete props.__source;
    delete props.__self;

    ref = props.ref;
    // delete props.ref; // props内部没有ref属性

    key = props.key;
    delete props.key; // props内部没有key属性
  }

  if (arguments.length > 3) {
    props.children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom);
  } else if (children !== undefined) {
    props.children = wrapToVdom(children);
  }

  // 返回的虚拟dom，key、ref是和type、props平级的
  return {
    type,
    props,
    key,
    ref,
  }
}

/*
* 创建ref实例
* */
function createRef() {
  return {
    current: null,
  }
}

/**
 * 不能在函数组件上使用ref，因为函数组件没有实例
 * Ref 转发允许某些组件接收 ref，并将其向下传递（换句话说，“转发”它）给子组件
 * @param FunctionComponent
 */
function forwardRef(FunctionComponent) {
  return class extends Component {
    render() {
      return FunctionComponent(this.props, this.props.ref);
    }
  }
}

export default {
  createElement,
  Component,
  createRef,
  forwardRef,
}
