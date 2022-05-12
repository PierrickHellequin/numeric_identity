import React, { Component } from "react";
// ganache mode
import RewardTokenDai from "../contracts/RewardTokenDai.json";


var Web3 = require('web3');


// contracts
// import DaiContract from "../contracts/Dai.json";
// import UbiContract from "../contracts/Ubi.json";
var DAIAdress = "";
var UBIAdress = "";






class RewardsComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      daiBalance: 0,
      ubiBalance: 0,
    };
    this.handleClick = this.handleClick.bind(this);
   
  }

  componentDidMount = async () => 
  {
    // ganache mode
    DAIAdress = "";
    UBIAdress = "";

    const networkId = await this.props.web3.eth.net.getId();
    const deployedNetwork = RewardTokenDai.networks[networkId];
    // ganache mode
    const instanceDai = new this.props.web3.eth.Contract(RewardTokenDai.abi, deployedNetwork && deployedNetwork.address);
    const instanceUbi = new this.props.web3.eth.Contract(RewardTokenDai.abi, deployedNetwork && deployedNetwork.address);

    var balanceDAI = await instanceDai.methods.balanceOf(this.props.account).call();
    var balanceUBI = await instanceUbi.methods.balanceOf(this.props.account).call();

    console.log("toto "+balanceDAI);

    this.setState({
      daiBalance: balanceDAI,
      ubiBalance: balanceUBI,
    
    });

    
  };

  handleClick() {
    this.props.onClaim();
  }

  render() {
    const DaiValue = Web3.utils.fromWei(Web3.utils.toBN(this.props.RewardsAmountEstimated), 'ether');

    console.log("titi "+this.state.daiBalance);


    const DaiBalance = Web3.utils.fromWei(Web3.utils.toBN(this.state.daiBalance), 'ether');
    const UbiBalance = Web3.utils.fromWei(Web3.utils.toBN(this.state.ubiBalance), 'ether');

    console.log("tata "+DaiBalance);

    var rewardsText = DaiValue + " Dai";
    var balDaiTxt = DaiBalance + " Dai";
    var balUbiTxt = UbiBalance + " Ubi";
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
        <div class="row">
          <div class="col-md-1">Dai balance</div>
          <div class="col-md-2">{balDaiTxt}</div>
        </div>
        <div class="row">
          <div class="col-md-1">Ubi balance</div>
          <div class="col-md-2">{balUbiTxt}</div>
        </div>
 
      </div>
    );
  }
}

export default RewardsComp;
