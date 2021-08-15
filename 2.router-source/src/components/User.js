import React from 'react';

export default class User extends React.Component {
  render() {
    console.log(JSON.stringify(this.props, null, 2));

    return (
        <div>
          User
        </div>
    );
  }
}
