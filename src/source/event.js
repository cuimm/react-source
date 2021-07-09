import {updateQueue} from './Component';

/**
 * 实现事件委托，把所有事件都委托到document上
 * @param dom
 * @param eventType
 * @param handler
 */
export function addEvent(dom, eventType, handler) {
  dom.store = dom.store || {}; // dom上绑定store属性，上面存放着此DOM上对应的事件处理函数

  dom.store[eventType] = handler;

  // 如果有多个元素绑定click事件，往document上只挂一次，updateQueue.
  if (!document[eventType]) {
    document[eventType] = dispatchEvent;
  }
}

function dispatchEvent(event) {
  let {type, target} = event;
  const eventType = `on${type}`;

  // 切换为批量更新模式
  updateQueue.isBatchingUpdate = true;

  const syntheticEvent = createSyntheticEvent(event);

  // 模拟事件冒泡
  while (target) {
    let {store} = target;
    const handler = store && store[eventType];
    handler && handler.call(target, syntheticEvent); // 事件从最内层向上传播，一直到document
    target = target.parentNode;
  }
  updateQueue.isBatchingUpdate = false;
  updateQueue.batchUpdate();
}

/**
 * 合成事件
 * 源码内部在此做了一些浏览器兼容性处理
 * @param event 事件源
 */
function createSyntheticEvent(event) {
  const syntheticEvent = {};
  for (let key in event) {
    syntheticEvent[key] = event[key];
  }
  return syntheticEvent;
}
