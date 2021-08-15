import {REACT_TEXT} from './constants';

/**
 * 包装元素，将文本节点转化为对象，方便后续dom diff
 * @param element
 * @returns {*}
 */
export function wrapToVdom(element) {
  if (typeof element === 'string' || typeof element === 'number') {
    return {
      type: REACT_TEXT,
      props: {
        content: element,
      }
    }
  }
  return element
}

/**
 * 对象浅比较
 * @param obj1
 * @param obj2
 * @returns {boolean}
 */
export function shallowEqual(obj1 = {}, obj2 = {}) {
  if (obj1 === obj2) {
    return true;
  }
  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return false;
  }
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (let key in obj1) {
    if (!obj2.hasOwnProperty(key) || obj1[key] !== obj2[key]) {
      return false;
    }
  }
  return true;
}
