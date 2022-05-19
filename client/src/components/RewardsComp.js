import React, { Component } from "react";
import daiIcon from "../assets/images/ic-dai.png";


import {
  getSupplyAPY,
  getTotalSupply,
  mintTokens,
  getExchangeRate,
  getMySupply,
  withdrawToken,
} from "../api/Compound";


import { abiJson } from "../api/AbiJson.js";




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
var cdaiAddress = "0x6D7F0754FFeb405d23C51CE938289d4835bE3b14";
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

  componentDidMount = async () => {

    if ((typeof this.props.web3 !== 'undefined') && (this.props.web3 !== null))
    {
      const networkId = await this.props.web3.eth.net.getId();
      const deployedNetwork = RewardTokenDai.networks[networkId];
      // ganache mode
      // const instanceDai = new this.props.web3.eth.Contract(RewardTokenDai.abi, deployedNetwork && deployedNetwork.address);
      // const instanceUbi = new this.props.web3.eth.Contract(RewardTokenDai.abi, deployedNetwork && deployedNetwork.address);

      let instanceDai = new this.props.web3.eth.Contract(abiDai, daiAdress);
      // TODO: ubi on rinkeby
      let instanceUbi = new this.props.web3.eth.Contract(abiDai, daiAdress);

      let instanceCDai = new this.props.web3.eth.Contract(abiJson, cdaiAddress);

      var balanceDAI = await instanceDai.methods.balanceOf(this.props.account).call();
      var balanceUBI = await instanceUbi.methods.balanceOf(this.props.account).call();
      var balanceCDAI = await instanceCDai.methods.balanceOf(this.props.account).call();
      var exRate = await getExchangeRate();


      this.setState({
        daiContract: instanceDai,
        daiBalance: balanceDAI,
        ubiBalance: balanceUBI,
        cDaiBalance: balanceCDAI,
        supply: 0,
        receiving: 0,
        mySupply: 0,
        totalSupply: 0,
        supplyAPI: 0,
        exchangeRate: exRate,
        showErr: false,
        // for withdraw
        withdraw: 0,
        received: 0,
      });
    }


  }

  handleClick() {
    this.props.onClaim();
  }

  async mint() {
    if (this.state.supply > this.state.balance || this.state.supply == 0) {
      this.setState({ showErr: true });

    } else {
      this.setState({ showErr: false });

      await mintTokens(this.props.account, this.state.supply, this.state.daiContract);
      this.setState({ supply: 0 });
      this.setState({ receiving: 0 });
    }
  }

  async withdrawCompound() {
    if (this.state.withdraw > this.state.balance2 || this.state.withdraw == 0) {
      this.setState({ showErr: true });
    } else {
      this.setState({ showErr: false });
      withdrawToken(this.props.account, this.state.withdraw);
      this.setState({ withdraw: 0 });
      this.setState({ received: 0 });

    }
  }

  render() {
    const DaiValue = Web3.utils.fromWei(Web3.utils.toBN(this.props.RewardsAmountEstimated), 'ether');



    const DaiBalance = Web3.utils.fromWei(Web3.utils.toBN(this.state.daiBalance), 'ether');
    const UbiBalance = Web3.utils.fromWei(Web3.utils.toBN(this.state.ubiBalance), 'ether');
    let cDaiBalance = 0;//Web3.utils.fromWei(Web3.utils.toBN(this.state.cDaiBalance), 'ether');

 

    var rewardsText = DaiValue + " Dai";
    var balDaiTxt = DaiBalance + " Dai";
    var balUbiTxt = UbiBalance + " Ubi";


    var cDaiAmount;

    if (typeof this.state.receiving !== 'undefined') {
      cDaiAmount = this.state.receiving.toFixed(2);
    }
    else {
      cDaiAmount = 0;
    }


    if (typeof this.state.cDaiBalance !== 'undefined') {
      // cDai has 8 decimals
      //cDaiBalance = Web3.utils.fromWei(Web3.utils.toBN(this.state.cDaiBalance), 'ether');
      cDaiBalance = Web3.utils.toBN(this.state.cDaiBalance)/ (Web3.utils.toBN(Math.pow(10, 8)));

    }


    return (
      <div className="Claim">


        <div class="card" style={{ width: '128rem' }}>
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

        <div class="card" style={{ width: '128rem' }}>
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
                  this.setState({ supply: DaiBalance });
                  this.setState({ receiving: (DaiBalance / this.state.exchangeRate) });

                }}
              >
                MAX
            </div>
              <input
                type="number"
                className="valuebox"
                onChange={(e) => {
                  this.setState({ supply: e.target.value });

                  this.setState({ receiving: (e.target.value / this.state.exchangeRate) });

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
        </div>
         <div className="input-container withdraw">
          <div className="input-title">Withdraw</div>
          <div className="balance">Deposited: {cDaiBalance} cDAI</div>
         <div className="input-row">
            <div className="input-box coin">
              <img alt="daiLogo" src={daiIcon} className="coinicon" />
              DAI
          </div>
            <div className="input-box value">
              <div
                className="maxbtn"
                onClick={() => {

                  this.setState({ withdraw: cDaiBalance });
                  this.setState({ received: (cDaiBalance * this.state.exchangeRate).toFixed(4) });

                }}
              >
                MAX
            </div>
              <input
                type="number"
                className="valuebox"
                onChange={(e) => {
  
                  this.setState({ withdraw: e.target.value });
                  this.setState({ received: (e.target.value * this.state.exchangeRate).toFixed(4) });


                }}
                value={this.state.withdraw}
              />
              <div className="currency">cDAI</div>
            </div>
          </div>
          <div className="receiving">
            Receiving Estimated
          <div>{this.state.received} DAI</div>
          </div>
          <div className="submit-btn" onClick={() => this.withdrawCompound()}>
            Withdraw
        </div>
        </div> 
      </div>
    );
  }
}

export default RewardsComp;
