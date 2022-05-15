import React, { Component } from "react";
import {
  Navbar,
  Nav,
  Container,
} from "react-bootstrap";
import Connect from "./Connect";
import "bootstrap/dist/css/bootstrap.min.css";

class NavbarSimple extends Component {
  constructor(props) {
    super(props);
    this.handleConnect = this.handleConnect.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(linkNumber, propNumber) {
    this.props.onPageChangedClicked(linkNumber, propNumber);
  }

  handleConnect() {
    this.props.onConnect();
  }

  render() {
    return (

      <header>
        <Navbar variant="dark fixed-top">
          <Container>
            <Navbar.Brand href="#home" id="logo" className="text-uppercase navbar-brand">E-CIVIL</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link onClick={() => this.handleClick(0)} href="#home">
                  Home
                </Nav.Link>
                <Nav.Link onClick={() => this.handleClick(1)} href="#reward">
                  Reward
                </Nav.Link>
                <Nav.Link onClick={() => this.handleClick(3)} href="#profil">
                  Identité
                </Nav.Link>
                <Nav.Link onClick={() => this.handleClick(2)} href="#admin">
                  Validateurs
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
            <Navbar.Collapse className="justify-content-end">
              {this.props.account ? (
                <Nav.Link
                  href={`https://etherscan.io/address/${this.props.account}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button nav-button btn-sm mx-4 "
                >
                  {this.props.account.slice(0, 5) +
                    "..." +
                    this.props.account.slice(38, 42)}
                </Nav.Link>
              ) : (
                <Connect
                  onConnect={this.handleConnect}
                  connectStatus={this.props.connectStatus}
                  account={this.props.account}
                  blockchain={this.props.blockchain}
                  amount={this.props.amount}
                />
              )}
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>

    );
  }
}

export default NavbarSimple;
