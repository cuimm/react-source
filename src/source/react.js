import { wrapToVdom } from './utils';
import { Component } from './Component';

/**
 * @param type 元素的类型
 * @param config 配置对象
 * @param children 儿子或儿子们。children可能是一个字符串、数字、null、undefined、数组
 */
function createElement(type, props, children) {
  if (arguments.length > 3) {
    props.children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom);
  } else if (children !== undefined) {
    props.children = wrapToVdom(children);
  }

  return {
    type,
    props,
  }
}

export default {
  createElement,
  Component,
}
