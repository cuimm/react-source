// import React from 'react';
// import ReactDOM from 'react-dom';

import React from './source/react';
import ReactDOM from './source/react-dom';

const root = document.getElementById('root');

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
        console.log('Counter 3.render');
        return (
            <div>
                <p>{this.props.name}: {this.state.number}</p>
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

ReactDOM.render(<Counter/>, root);
