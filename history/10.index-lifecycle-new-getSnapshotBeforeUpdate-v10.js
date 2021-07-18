// import React from 'react';
// import ReactDOM from 'react-dom';

import React from './source/react';
import ReactDOM from './source/react-dom';

class ScrollList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            massages: [],
        };
        this.wrapper = React.createRef();
    }

    componentDidMount() {
        this.timer = setInterval(() => {
            this.addMessage();
        }, 1000);
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {
        return {
            prevScrollTop: this.wrapper.current.scrollTop, // 更新前向上卷去的高度
            prevScrollHeight: this.wrapper.current.scrollHeight, // 更新前内容的高度
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {prevScrollTop, prevScrollHeight} = snapshot;

        // 更新后设置向上卷去的高度 = 更新前卷去的高度 + 本次更新增加的高度
        this.wrapper.current.scrollTop = prevScrollTop + (this.wrapper.current.scrollHeight - prevScrollHeight);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    // 每隔1s往messages里面添加一个新的元素
    addMessage = () => {
        this.setState({
            massages: [this.state.massages.length, ...this.state.massages]
        });
    };

    render() {
        const style = {
            width: '100px',
            height: '100px',
            border: '1px solid red',
            overflow: 'auto',
        };
        return (
            <div style={style} ref={this.wrapper}>
                {
                    this.state.massages.map((message, index) => {
                        return <div key={index}>{message}</div>
                    })
                }
            </div>
        );
    }
}

ReactDOM.render(<ScrollList />, document.getElementById('root'));