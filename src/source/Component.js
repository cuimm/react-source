import { findDOM, compareTwoVdom } from './react-dom';

function shouldUpdate(classInstance, nextState) {
  classInstance.state = nextState; // 更新state
  classInstance.forceUpdate();
}

class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance; // 类组件实例
    this.pendingStates = []; // 保存需要更新的队列
    this.callbacks = []; // 保存将要执行的回调函数
  }

  addState(partialState, callback) {
    this.pendingStates.push(partialState);
    if (typeof callback === 'function') {
      this.callbacks.push(callback);
    }
    this.emitUpdate();
  }

  /**
   * 触发更新逻辑
   * 不管状态和属性是否变化，都会执行此方法
   */
  emitUpdate() {
    this.updateComponent();
  }

  updateComponent() {
    const {classInstance, pendingStates} = this;
    if (pendingStates.length > 0) {
      /** 有等待更新的队列 **/
      shouldUpdate(classInstance, this.getState());
    }
  }

  /**
   * 计算新的state值
   * @returns {Updater.classInstance.state}
   */
  getState() {
    let {classInstance, pendingStates} = this;
    let {state} = classInstance;

    pendingStates.forEach(nextState => {
      if (typeof nextState === 'function') {
        nextState = nextState(state);
      }
      state = {...state, ...nextState};
    });

    pendingStates.length = 0; // state计算完毕,清空等待更新的队列

    this.callbacks.forEach(callback => callback());
    this.callbacks.length = 0;

    return state;
  }
}

export class Component {
  /** 标记类组件 **/
  static isReactComponent = true;

  constructor(props) {
    this.props = props;
    this.state = {};
    this.updater = new Updater(this); // 每一个类组件都有一个Updater更新器
  }

  setState(partialState, callback) {
    this.updater.addState(partialState, callback);
  }

  /**
   * 组件更新
   * 1. 获取老的虚拟DOM
   * 2. 根据最新的属性和状态计算新的虚拟DOM
   * 3. 进行比较，查找差异，然后把这些差异同步到真实DOM上
   */
  forceUpdate() {
    const oldRenderVdom = this.oldRenderVdom; // 老的虚拟dom
    const oldDOM = findDOM(oldRenderVdom); // 根据老的虚拟dom查找老的真实DOM
    const newRenderVdom = this.render(); // 计算出新的虚拟dom
    compareTwoVdom(oldDOM.parentNode, oldRenderVdom, newRenderVdom); // 比较差异，把差异更新到真实DOM上
    this.oldRenderVdom = newRenderVdom;
  }
}
