// import React from 'react';
// import ReactDOM from 'react-dom';

import React from './source/react';
import ReactDOM from './source/react-dom';

// AntDesignButton 为第三方组件
class AntDesignButton extends React.Component {
    state = {name: 'cuimm'}

    componentWillMount() {
        console.log('AntDesignButton componentWillMount');
    }

    componentDidMount() {
        console.log('AntDesignButton componentDidMount');
    }

    render() {
        console.log('AntDesignButton render');
        return (
            <button name={this.state.name}>
                {this.props.title}
            </button>
        );
    }
}

const wrapper = OldComponent => {
    return class extends OldComponent {
        // state = {number: 0};

        constructor(props) {
            super(props);

            this.state = {
                ...this.state, // 获取父组件的state
                number: 0,
            }
        }

        componentWillMount() {
            console.log('wrapper componentWillMount');
            super.componentWillMount();
        }

        componentDidMount() {
            console.log('wrapper componentDidMount');
            super.componentDidMount();
        }

        handleClick = () => {
            this.setState({number: this.state.number + 1});
        }

        render() {
            console.log('wrapper render', this.state);
            const renderElement = super.render();
            const newProps = {
                ...renderElement.props,
                title: this.state.name,
                onClick: this.handleClick,
            };
            const cloneElement = React.cloneElement(renderElement, newProps, this.state.number);
            return cloneElement;
        }
    }
}

const WrapperAntDesignButton = wrapper(AntDesignButton);

ReactDOM.render(<WrapperAntDesignButton title='报表'/>, document.getElementById('root'));
