import {REACT_FORWARD_REF_TYPE, REACT_PROVIDER, REACT_CONTEXT} from './constants';
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
    delete props.ref; // props内部没有ref属性

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

/**
 * 根据老的元素，克隆出一个新的元素
 * @param oldElement 老元素
 * @param newProps 新属性
 * @param children 新儿子
 */
function cloneElement(oldElement, newProps, children) {
  if (arguments.length > 3) {
    children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom);
  } else {
    children = wrapToVdom(children);
  }
  const props = {
    ...oldElement.props,
    ...newProps,
    children,
  };
  return {
    ...oldElement,
    props,
  };
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
 * @param render 要转发的函数组件
 */
function forwardRef(render) {
  return {
    $$typeof: REACT_FORWARD_REF_TYPE,
    render,
  }
}

/**
 * 创建Context上下文
 */
function _createContext() {
  const context = {
    Provider,
    Consumer,
  };

  /**
   * Provider(生产者): 用于生产共享数据的地方
   * @param props Provider组件的props
   * @returns 返回Provider组件的子元素
   * @constructor
   */
  function Provider(props) {
    const {value, children} = props;
    context._value = value; // 将props中的value值（上下文共享数据）绑定到context上
    return children;
  }

  /**
   * Consumer(消费者): 消费者，专门消费供应商(Provider)产生数据
   * @param props
   * @returns {*}
   * @constructor
   */
  function Consumer(props) {
    const {children} = props;
    return children(context._value);
  }

  return context;
}

/**
 * 创建Context上下文
 */
function createContext() {
  const context = {
    $$typeof: REACT_CONTEXT
  };
  context.Provider = {
    $$typeof: REACT_PROVIDER,
    _context: context,
  };
  context.Consumer = {
    $$typeof: REACT_CONTEXT,
    _context: context,
  };
  return context;
}

export default {
  createElement,
  Component,
  createRef,
  forwardRef,
  createContext,
  cloneElement,
}

/*
function forwardRef(FunctionComponent) {
  return class extends Component {
    render() {
      return FunctionComponent(this.props, this.props.ref);
    }
  }
}
*/
