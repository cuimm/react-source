// import React from 'react';
// import ReactDOM from 'react-dom';

import React from './source/react';
import ReactDOM from './source/react-dom';

const ThemeContext  = React.createContext();
const {Provider, Consumer} = ThemeContext;

class Header extends React.Component {
    static contextType = ThemeContext; // 此处的contextType变量名是固定的. 声明该静态属性之后，该类组件内部可以使用this.context获取上下文.

    render() {
        return (
            <div style={{margin: '10px', border:`5px solid ${this.context.color}`, padding: '5px'}}>
                头部
                <Title />
            </div>
        );
    }

}

class Title extends React.Component {
    static contextType = ThemeContext;

    render() {
        return (
            <div style={{margin: '10px', border:`5px solid ${this.context.color}`, padding: '5px'}}>
                标题
            </div>
        );
    }
}

/**
 *  Consumer(消费者): 消费者。专门消费供应商(Provider 上面提到的)产生数据。
 *  Consumer需要嵌套在生产者下面。才能通过回调的方式拿到共享的数据源。当然也可以单独使用，那就只能消费到上文提到的defaultValue
 * @param props
 * @returns {*}
 * @constructor
 */
function Main(props) {
    return (
        <Consumer>
            {
                value => {
                    return (
                        <div style={{margin: '10px', border: `5px solid ${value.color}`, padding: '5px'}}>
                            内容
                            <Content/>
                        </div>
                    )
                }
            }
        </Consumer>
    );
}

/*
class Main extends React.Component {
    static contextType = ThemeContext;

    render() {
        return (
            <div style={{margin: '10px', border: `5px solid ${this.context.color}`, padding: '5px'}}>
                内容
                <Content />
            </div>
        );
    }

}
*/

class Content extends React.Component {
    static contextType = ThemeContext;

    render() {
        return (
            <div style={{margin: '10px', border:`5px solid ${this.context.color}`, padding: '5px'}}>
                <button onClick={this.context.changeColor.bind(this, 'blue')}>变蓝</button>
                <button onClick={() => this.context.changeColor('green')}>变绿</button>
            </div>
        );
    }
}

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {color: 'red'};
    }
    changeColor = color => {
        this.setState({
            color: color
        });
    };
    render() {
        const style = {
            margin: '10px',
            border: `5px solid ${this.state.color}`,
            padding: '5px',
            width: '200px',
        };
        const value = {color: this.state.color, changeColor: this.changeColor};
        return (
            <Provider value={value}>
                <div style={style}>
                    主页
                    <Header/>
                    <Main />
                </div>
            </Provider>
        );
    }
}

ReactDOM.render(<Page/>, document.getElementById('root'));