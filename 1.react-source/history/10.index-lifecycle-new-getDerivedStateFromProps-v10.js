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

    /**
     * getDerivedStateFromProps是为了取代componentWillReceiveProps
     * 因为有很多人在使用componentWillReceiveProps会调用this.setState经常引起死循环
     */
    static getDerivedStateFromProps(nextProps, prevState) {
        console.log('ChildCounter getDerivedStateFromProps', nextProps, prevState);

        const {count} = nextProps;

        // return null; // 返回null不修改状态

        return {...prevState, count: count * 2};
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
