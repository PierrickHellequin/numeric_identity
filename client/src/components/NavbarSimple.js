import React, { Component } from "react";

import { Button, Navbar, Nav, NavItem, NavDropdown, MenuItem, Container } from 'react-bootstrap';
import Connect from "./Connect";

import img from "../images/Ethereum_logo_2014.svg"; 





class NavbarSimple extends Component {

  constructor(props) {
    super(props);
    this.handleConnect = this.handleConnect.bind(this);

  }

  componentDidMount = async () => {


  };

  handleConnect() {
    this.props.onConnect();
  }



  render() {

    return (
      <Navbar >
        <Navbar.Brand href="#home" className="ml-auto">
          <img
            alt=""
          
            src={img}
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{' '}
          Decentralized Id Dapp
        </Navbar.Brand>
        <Nav className="ms-auto">
          <Connect onConnect={this.handleConnect}
            connectStatus={this.props.connectStatus}
            account={this.props.account}
            blockchain={this.props.blockchain}
            amount={this.props.amount} /></Nav>

      </Navbar>
    );

  }

}

export default NavbarSimple;