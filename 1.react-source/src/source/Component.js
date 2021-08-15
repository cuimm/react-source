import { shallowEqual } from './utils';
import { findDOM, compareTwoVdom } from './react-dom';

function shouldUpdate(classInstance, nextProps, nextState) {
  let willUpdate = true;

  /** 生命周期 shouldComponentUpdate 是否更新 **/
  if (classInstance.shouldComponentUpdate && (!classInstance.shouldComponentUpdate(nextProps, nextState))) {
    willUpdate = false;
  }

  /** 生命周期 componentWillUpdate 即将更新 **/
  if (willUpdate && classInstance.componentWillUpdate) {
    classInstance.componentWillUpdate();
  }

  // 不管组件要不要更新，属性和状态都要更新成最新的
  if (nextProps) {
    classInstance.props = nextProps;
  }

  /** 生命周期 getDerivedStateFromProps 从新属性上派生状态 接收参数：新属性 老状态 **/
  if (classInstance.constructor.getDerivedStateFromProps) {
    const iNextState = classInstance.constructor.getDerivedStateFromProps(nextProps, classInstance.state);
    if (nextState) {
      classInstance.state = iNextState;
    }
  } else {
    classInstance.state = nextState;
  }

  if (willUpdate) {
    classInstance.forceUpdate();
  }
}

/**
 * 批量更新
 */
export const updateQueue = {
  isBatchingUpdate: false, // 通过此变量控制是否进行批量更新
  updaters: [], // 内部存放将要执行更新的Updater实例
  batchUpdate() {
    for (let updater of updateQueue.updaters) {
      updater.updateComponent();
    }
    updateQueue.isBatchingUpdate = false;
    updateQueue.updaters.length = 0;
  },
};

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
   *
   * state: 执行setState，状态改变，触发emitUpdate更新
   * props：属性变化，直接触发emitUpdate更新
   */
  emitUpdate(nextProps) {
    this.nextProps = nextProps; // 可能传过来一些其他属性

    if (updateQueue.isBatchingUpdate) { // 如果是批量更新模式，那么就把此Updater实例添加到updateQueue中去
      updateQueue.updaters.push(this);
    } else {
      this.updateComponent(); // 非批量更新模式，直接更新组件
    }
  }

  updateComponent() {
    const {classInstance, pendingStates, nextProps} = this;
    if (nextProps || (pendingStates.length > 0)) {
      /** 有等待更新的队列 **/
      shouldUpdate(classInstance, nextProps, this.getState());
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

    /** 如果使用了Context上下文 => 组件在更新时需重新获取Context上下文对象，否则，子组件不会更新 **/
    if (this.constructor.contextType) {
      this.context = this.constructor.contextType._currentValue;
    }

    const newRenderVdom = this.render(); // 计算出新的虚拟dom

    /** 生命周期 getSnapshotBeforeUpdate 获取更新前快照 **/
    let extraArgs;
    if (this.getSnapshotBeforeUpdate) {
      extraArgs = this.getSnapshotBeforeUpdate();
    }

    compareTwoVdom(oldDOM.parentNode, oldRenderVdom, newRenderVdom); // 比较差异，把差异更新到真实DOM上
    this.oldRenderVdom = newRenderVdom;

    /** 生命周期  componentDidUpdate 更新完毕 **/
    if (this.componentDidUpdate) {
      this.componentDidUpdate(this.props, this.state, extraArgs);
    }
  }
}

export class PureComponent extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState);
  }
}
