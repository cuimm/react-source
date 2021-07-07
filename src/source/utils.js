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
