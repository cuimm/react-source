import React from 'react';

export default class Home extends React.Component {
  render() {
    console.log(this.props);
    console.log(JSON.stringify(this.props, null, 2));
    /*
    {
      "history": {
        "length": 2,
        "action": "POP",
        "location": {
          "pathname": "/user",
          "search": "",
          "hash": ""
        }
      },
      "location": {
        "pathname": "/user",
        "search": "",
        "hash": ""
      },
      "match": {
        "path": "/user",
        "url": "/user",
        "isExact": true,
        "params": {}
      }
    }
    * */

    return (
        <div>
          Home
        </div>
    );
  }
}
