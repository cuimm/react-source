// import React from 'react';
// import ReactDOM from 'react-dom';

import React from './source/react';
import ReactDOM from './source/react-dom';

const withLoading = Component => {
    return class extends React.Component {
        show = () => {
            const loading = document.createElement('div');
            loading.innerHTML = `
                <div id="loading" style='position: fixed; top: 50%; right: 0; bottom: 0; left: 50%;'>
                     努力加载中...
                </div>
            `;
            document.body.appendChild(loading);
        };
        hide = () => {
            document.getElementById('loading').remove();
        };
        render() {
            return (
                <Component {...this.props} show={this.show} hide={this.hide} />
            );
        }
    }
};

@withLoading
class Panel extends React.Component {
    render() {
        return (
            <div>
                <h1>{this.props.title}</h1>
                <button onClick={this.props.show}>显示</button>
                <button onClick={this.props.hide}>隐藏</button>
            </div>
        );
    }
}

// const LoadingPanel = withLoading(Panel);

ReactDOM.render(<Panel title='报表'/>, document.getElementById('root'));