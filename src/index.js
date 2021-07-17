// import React from 'react';
// import ReactDOM from 'react-dom';

import React from './source/react';
import ReactDOM from './source/react-dom';

class ChildCounter extends React.Component {
    static defaultProps = {
        name: 'ChildCounter'
    };

    constructor(props) {
        super(props);
        this.state = {number: 1};
    }

    componentWillMount() {
        console.log('ChildCounter 1.componentWillMount');
    }

    render() {
        console.log('ChildCounter 2.render');
        return (
            <div>
                {this.props.name}:{this.props.count}
            </div>
        )
    }

    componentDidMount() {
        console.log('ChildCounter 3.componentDidMount');
    }

    componentWillReceiveProps() {
        console.log('ChildCounter 4.componentWillReceiveProps');
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log('ChildCounter 5.shouldComponentUpdate');
        return nextProps.count % 3 === 0; // 子组件count是3的倍数才更新
    }

    componentWillUnmount() {
        console.log('ChildCounter 6.componentWillUnmount');
    }
}

class Counter extends React.Component {
    static defaultProps = {
        name: 'Counter'
    };

    constructor(props) {
        super(props);
        this.state = {number: 0};
        console.log('Counter 1.constructor');
    }

    handleClick = () => {
        this.setState({
            number: this.state.number + 1
        });
    };

    componentWillMount() {
        console.log('Counter 2.componentWillMount');
    }

    /**
     * 当属性或者状态发生变化的时候，会走此方法来决定是否要渲染更新
     * setState会引起状态的变化
     * 父组件更新的时候，会让子组件的属性prop发生变化
     * @param nextProps 新属性
     * @param nextState 新状态
     * @returns {boolean} true更新 false不更新
     */
    shouldComponentUpdate(nextProps, nextState) {
        console.log('Counter 5.shouldComponentUpdate', this.state.number, nextState.number); // 第一次点击按钮+，this.state.number=0 nextState.number=1
        return nextState.number % 2 === 0; // 奇数更新，偶数不更新
    }

    componentWillUpdate() {
        console.log('Counter 6.componentWillUpdate');
    }

    render() {
        console.log('Counter 3.render', );
        /*
            => 当this.state.number === 4时，经babel解析的vdom结构为：
            {
                type: 'div',
                props: {
                    id: 'id_4',
                    children: [
                        { type: 'p' },
                        null,
                        { type: 'button' }
                    ]
                }
            }
            => div的子节点个数为3，第2个子节点为null
        */
        return (
            <div id={`id_${this.state.number}`}>
                <p>{this.props.name}: {this.state.number}</p>
                {this.state.number === 4 ? null : <ChildCounter count={this.state.number}/>}
                <button onClick={this.handleClick}>+</button>
            </div>
        )
    }

    componentDidUpdate() {
        console.log('Counter 7.componentDidUpdate');
    }

    componentDidMount() {
        console.log('Counter 4.componentDidMount');
    }
}

ReactDOM.render(<Counter/>, document.getElementById('root'));
