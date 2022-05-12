import React, { Component } from "react";
var Web3 = require('web3');
class RewardsComp extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount = async () => { };

  handleClick() {
    this.props.onClaim();
  }

  render() {
    const DaiValue = Web3.utils.fromWei(this.props.RewardsAmountEstimated, 'ether');
    var rewardsText = DaiValue + " Dai";
    return (
      <div className="Claim">
        {/* <h2>{this.props.RewardsAmountEstimated}</h2>
        <button type="button" onClick={() => this.handleClick()}>
          Claim
        </button>*/}

        <div class="row">
          <div class="col-md-1">Your rewards</div>
          <div class="col-md-2">{rewardsText}</div>
        </div>
        <div class="row">
          <div class="col-md-1"> <button type="button" onClick={() => this.handleClick()}>
            Claim
          </button></div>
        </div>
      </div>
    );
  }
}

export default RewardsComp;
