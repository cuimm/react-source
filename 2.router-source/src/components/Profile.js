import React from 'react';

export default class Profile extends React.Component {
  render() {
    console.log(JSON.stringify(this.props, null, 2));

    return (
        <div>
          Profile
        </div>
    );
  }
}
