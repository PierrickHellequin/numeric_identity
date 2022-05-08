import React, { Component } from "react";
import Mainpage from "./Mainpage";
import RewardsComp from "./RewardsComp";
import Admin from "./admin";
import Profil from "./Profil";
class MainpageSelector extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(linkNumber, propNumber) {
    this.props.onPageChangedClicked(linkNumber, propNumber);
  }

  render() {
    if (this.props.curPage === 0) {
      return <Mainpage />;
    } else if (this.props.curPage === 1) {
      return (
        <RewardsComp onClaim={this.props.onClaim} RewardsAmountEstimated={0} />
      );
    } else if (this.props.curPage === 2) {
      return <Admin />;
    }
    else if(this.props.curPage === 3){
      return <Profil account={this.props.account}/>
    }
  }
}

export default MainpageSelector;
