import React, { Component } from "react";
import { Button } from "react-bootstrap";

class Connect extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.onConnect();
  }

  render() {
    if (this.props.connectStatus === 0) {
      // NOT CONNECTED
      return <Button onClick={() => this.handleClick()}>Connect</Button>;
    } else if (this.props.connectStatus === 1) {
      // CONNECTED
      return (
        <div className="container-fluid">
          <ul className="nav navbar-nav navbar-right">
            <li>
              <a className="nav-link maclasstextcolorwhite">
                {this.props.blockchain}
              </a>
            </li>
            <li>
              <a className="nav-link maclasstextcolorwhite">
                {this.props.amount + " ETH"}
              </a>
            </li>
            <li>
              <a className="nav-link maclasstextcolorwhite">{this.props.account}</a>
            </li>
          </ul>
        </div>
      );
    } else if (this.props.connectStatus === 2) {
      // CONNECTION ISSUE
      return <h3 className="px-0 align-middle text-white">invalid network</h3>;
    } else {
      // CONNECTION ISSUE
      return <h3 className="px-0 align-middle text-white">invalid network</h3>;
    }
  }
}

export default Connect;
