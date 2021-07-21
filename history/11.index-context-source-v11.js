// import React from 'react';
// import ReactDOM from 'react-dom';

import React from './source/react';
import ReactDOM from './source/react-dom';

const GrandFatherContext = React.createContext();
const FatherContext = React.createContext();

console.log('GrandFatherContext', GrandFatherContext);

class Son extends React.Component {
  render() {
    return (
        <GrandFatherContext.Consumer>
          {
            grandFatherValue => {
              return (
                  <FatherContext.Consumer>
                    {
                      fatherValue => {
                        return (
                            <div style={{border: '2px solid blue', padding: '30px'}}>
                              <p>父亲name：{fatherValue.name}</p>
                              <p>父组件code：{fatherValue.code}</p>
                              <p>grand组件name：{grandFatherValue.name}</p>
                              <p>grand组件address：{grandFatherValue.address}</p>
                              <p>grand组件number：{grandFatherValue.number}</p>
                            </div>
                        )
                      }
                    }
                  </FatherContext.Consumer>
              )
            }
          }
        </GrandFatherContext.Consumer>
    );
  }
}

class Father extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Father_X',
      code: 64,
    };
  }

  render() {
    const fatherValue = {
      name: this.state.name,
      code: this.state.code,
    };
    return (
        <FatherContext.Provider value={fatherValue}>
          <div style={{border: '2px solid green', padding: '30px'}}>
            <Son/>
          </div>
        </FatherContext.Provider>
    );
  }
}

class GrandFather extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'GrandFather_G',
      address: '山东',
      number: 0,
    };
  }

  handleClick = () => {
    this.setState({
      number: this.state.number + 1
    });
  }

  render() {
    const value = {
      name: this.state.name,
      address: this.state.address,
      number: this.state.number,
    };
    return (
        <GrandFatherContext.Provider value={value}>
          <div style={{border: '2px solid red', padding: '30px'}}>
            GrandFather: {this.state.number}
            <Father/>
            <button onClick={this.handleClick}>点击</button>
          </div>
        </GrandFatherContext.Provider>
    );
  }
}

ReactDOM.render(<GrandFather title='报表'/>, document.getElementById('root'));
