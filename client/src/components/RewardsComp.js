import React, { Component } from "react";
import daiIcon from "../assets/images/ic-dai.png";


import {
  getSupplyAPY,
  getTotalSupply,
  mintTokens,
  getExchangeRate,
  getMySupply,
} from "../api/Compound";

// ganache mode
import RewardTokenDai from "../contracts/RewardTokenDai.json";


var Web3 = require('web3');
const abiDai = [
  {
      "constant": true,
      "inputs": [],
      "name": "name",
      "outputs": [
          {
              "name": "",
              "type": "bytes32"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [
          {
              "name": "_spender",
              "type": "address"
          },
          {
              "name": "_value",
              "type": "uint256"
          }
      ],
      "name": "approve",
      "outputs": [
          {
              "name": "",
              "type": "bool"
          }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
          {
              "name": "",
              "type": "uint256"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [
          {
              "name": "_from",
              "type": "address"
          },
          {
              "name": "_to",
              "type": "address"
          },
          {
              "name": "_value",
              "type": "uint256"
          }
      ],
      "name": "transferFrom",
      "outputs": [
          {
              "name": "",
              "type": "bool"
          }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [
          {
              "name": "",
              "type": "uint8"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [
          {
              "name": "_owner",
              "type": "address"
          }
      ],
      "name": "balanceOf",
      "outputs": [
          {
              "name": "balance",
              "type": "uint256"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [],
      "name": "symbol",
      "outputs": [
          {
              "name": "",
              "type": "bytes32"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [
          {
              "name": "_to",
              "type": "address"
          },
          {
              "name": "_value",
              "type": "uint256"
          }
      ],
      "name": "transfer",
      "outputs": [
          {
              "name": "",
              "type": "bool"
          }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [
          {
              "name": "_owner",
              "type": "address"
          },
          {
              "name": "_spender",
              "type": "address"
          }
      ],
      "name": "allowance",
      "outputs": [
          {
              "name": "",
              "type": "uint256"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "payable": true,
      "stateMutability": "payable",
      "type": "fallback"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "name": "owner",
              "type": "address"
          },
          {
              "indexed": true,
              "name": "spender",
              "type": "address"
          },
          {
              "indexed": false,
              "name": "value",
              "type": "uint256"
          }
      ],
      "name": "Approval",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "name": "from",
              "type": "address"
          },
          {
              "indexed": true,
              "name": "to",
              "type": "address"
          },
          {
              "indexed": false,
              "name": "value",
              "type": "uint256"
          }
      ],
      "name": "Transfer",
      "type": "event"
  }
];

var daiAdress = "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa";

// contracts
// import DaiContract from "../contracts/Dai.json";
// import UbiContract from "../contracts/Ubi.json";




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


    const networkId = await this.props.web3.eth.net.getId();
    const deployedNetwork = RewardTokenDai.networks[networkId];
    // ganache mode
    // const instanceDai = new this.props.web3.eth.Contract(RewardTokenDai.abi, deployedNetwork && deployedNetwork.address);
    // const instanceUbi = new this.props.web3.eth.Contract(RewardTokenDai.abi, deployedNetwork && deployedNetwork.address);

    let instanceDai = new this.props.web3.eth.Contract(abiDai, daiAdress);
    let instanceUbi = new this.props.web3.eth.Contract(abiDai, daiAdress);


    var balanceDAI = await instanceDai.methods.balanceOf(this.props.account).call();
    var balanceUBI = await instanceUbi.methods.balanceOf(this.props.account).call();

    //console.log("toto "+balanceDAI);

    this.setState({
      daiContract:instanceDai,
      daiBalance: balanceDAI,
      ubiBalance: balanceUBI,
      supply:0,
      receiving:0,
      mySupply:0,
      totalSupply:0,
      supplyAPI:0,
      exchangeRate:0,
      showErr:false,
      modalIsOpen:false,

    
    });

    
  };

  handleClick() {
    this.props.onClaim();
  }

  async mint() {
    if (this.state.supply > this.state.balance || this.state.supply == 0) {
      this.setState({showErr:true});
      
    } else {
      this.setState({showErr:false});
      
      await mintTokens(this.props.account, this.state.supply,this.state.daiContract);
      this.setState({supply:0});
      this.setState({receiving:0});
    }
  }

  render() {
    const DaiValue = Web3.utils.fromWei(Web3.utils.toBN(this.props.RewardsAmountEstimated), 'ether');

    //console.log("titi "+this.state.daiBalance);


    const DaiBalance = Web3.utils.fromWei(Web3.utils.toBN(this.state.daiBalance), 'ether');
    const UbiBalance = Web3.utils.fromWei(Web3.utils.toBN(this.state.ubiBalance), 'ether');

    //console.log("tata "+DaiBalance);

    var rewardsText = DaiValue + " Dai";
    var balDaiTxt = DaiBalance + " Dai";
    var balUbiTxt = UbiBalance + " Ubi";


    var cDaiAmount;

    if (typeof this.state.receiving !== 'undefined') {
      cDaiAmount = this.state.receiving.toFixed(2);
  }
  else
  {
    cDaiAmount = 0;
  }


    return (
      <div className="Claim">
        {/* <h2>{this.props.RewardsAmountEstimated}</h2>
        <button type="button" onClick={() => this.handleClick()}>
          Claim
        </button>*/}

<div class="card" style={{width: '128rem'}}>
  <div class="card-body">
  <div class="row">

          <div class="col-md-1">Dai balance</div>
          <div class="col-md-2">{balDaiTxt}</div>
        </div>
       
        <div class="row">
          <div class="col-md-1">Ubi balance</div>
          <div class="col-md-2">{balUbiTxt}</div>
        </div>

 </div>
        </div>

        <div class="card" style={{width: '128rem'}}>
  <div class="card-body">
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
        </div>


    
    <div className="input-container">
        <div className="input-title">Compound protocol</div>
        <div className="balance">Balance: {DaiBalance} DAI</div>
        <div className="input-row">
         
           
        <div className="input-box coin">
            <img alt="daiLogo" src={daiIcon} className="coinicon" />
            DAI
          </div>
         
          <div className="input-box value">
            <div
              className="maxbtn"
              onClick={() => {
                this.setState({supply:DaiBalance});
                // tmp
                var exchangeRate = 1;
                this.setState({receiving:(DaiBalance/ exchangeRate)});
               
              }}
            >
              MAX
            </div>
            <input
              type="number"
              className="valuebox"
              onChange={(e) => {
                this.setState({supply:e.target.value});
                // tmp
                var exchangeRate = 1;
                this.setState({receiving:(e.target.value/ exchangeRate)});
               
              }}
             value={this.state.supply}
            />
            <div className="currency">DAI</div>
          </div>
        </div>
        <div className="receiving">
          Receiving
          <div>{
            cDaiAmount} cDAI</div>
        </div>
        <div className="submit-btn" onClick={() => this.mint()}>
          Supply
        </div>
        {/* {showErr && <div className="erroramount">Not enough balance</div>} */}
      </div>
      {/* <Modal
        isOpen={modalisOpen}
        style={modalStyles}
        onRequestClose={() => setIsopen(false)}
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
      >
        <h2>Transaction Submitted</h2>
        <div className="modal-view">
          Please confirm in Metamask
          <br />
          View on{" "}
          <a
            href="https://rinkeby.etherscan.io/address/0xd6801a1DfFCd0a410336Ef88DeF4320D6DF1883e"
            target="_blank"
          >
            Etherscan
          </a>
        </div>
        <div className="modal-btn" onClick={() => setIsopen(false)}>
          Done
        </div>
      </Modal> */}

  </div>

    );
  }
}

export default RewardsComp;
