import React, { Component } from "react";
import NavbarSimple from "./NavbarSimple";
import MainpageSelector from "./MainpageSelector";
import getWeb3Click from "../getWeb3";

//Load components
// import Navigation from "./components/Navbar";
// import Admin from "./components/admin";
// import Defi from "./components/protocole";
// import LoadUser from "./components/usersData";

// contracts
// Rewarder
import IdRewarder from "../contracts/IdFundedRewarder.json";



// css
import "../assets/css/appstyle.css";
class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentpage: 0,
      currentAccount: "",
      currentAmount: "",
      currentBlockchain: "",
      connectStatus: 0,
      theweb3: null,
      theaccounts: null,
      rewarderContract: null,
      estimatedReward: 0,
      intervalId: 0,
    };

    this.runInit = this.runInit.bind(this);
    this.accountChanged = this.accountChanged.bind(this);
    this.loadWeb3 = this.loadWeb3.bind(this);
    this.updateEstimatedReward = this.updateEstimatedReward.bind(this);
  }

  reload() {
    window.location.reload();
  }

  handleLinkClicked = (linkNumber, proposalNumber) => {
    this.setState({
      currentpage: linkNumber,
    });
  };

  handleConnect = async () => {
    await this.loadWeb3();
  };

  componentDidMount = async () => {
    // automatic connect only if no previous error
    console.log("connect status: " + this.state.connectStatus);

    //  this.loadWeb3();

    
    this.state.intervalId = setInterval(() => {
        this.runInit();
      }, 1000);

  };

  componentWillUnmount(){
    clearInterval(this.state.intervalId);
  }


  loadWeb3 = async () => {
    console.log("running loadweb3");

    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3Click();
      console.log(web3);

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      if (web3.currentProvider != null && web3.eth.net != null) {
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = IdRewarder.networks[networkId];
        const instance = new web3.eth.Contract(IdRewarder.abi, deployedNetwork && deployedNetwork.address);


        const bal = await web3.eth.getBalance(accounts[0]);
        var chainname = "undefined";
        if (networkId === 1) chainname = "mainnet";
        if (networkId === 5777) chainname = "ganache";
        if (networkId === 42) chainname = "kovan";
        // TODO: others networks ?
        var balEther = web3.utils.fromWei(bal, "ether");

        // contract should be dployed here

        this.setState(
          {
            currentAccount: accounts[0].toString(),
            currentAmount: balEther.toString(),
            currentBlockchain: chainname,
            connectStatus: 1,
            theweb3: web3,
            theaccounts: accounts,
            rewarderContract: instance,
          },
          this.runInit
        );

        console.log("contract found");
      }

      window.ethereum.on("accountsChanged", (accounts) => {
        this.accountChanged(accounts);
      });

      window.ethereum.on("chainChanged", (chainId) => {
        // Handle the new chain.
        // Correctly handling chain changes can be complicated.
        // We recommend reloading the page unless you have good reason not to.

        this.reload();
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );

      this.reload();
    }
  };

  async accountChanged(newaccounts) {
    console.log("accountsChanges", newaccounts);

    await this.loadWeb3();
  }

  updateEstimatedReward = async () => {
    const contract = this.state.rewarderContract;
    const accounts = this.state.theaccounts;
    if (accounts != null) {
      const result = await contract.methods.EstimateRewardForAddress(this.state.currentAccount).call();
      const rewards = result;
      this.setState({ estimatedReward: rewards });
    }
    console.log("update estimated rewards");
  };

  ClaimTransaction = async () => {
    const accounts = this.state.theaccounts;
    const contract = this.state.rewarderContract;
    try {
      await contract.methods.Claim().send({ from: this.state.currentAccount });
      this.runInit();
    }
    catch (error) {
      console.log(error);
    }
  };

  runInit = async () => {
    const contract = this.state.rewarderContract;
    if (contract != null) {
           // recup estimation rewards
        this.updateEstimatedReward();
    }
  };

  render() {
    return (
      //<Router>
      <div className="App">
        <NavbarSimple
          connectStatus={this.state.connectStatus}
          account={this.state.currentAccount}
          blockchain={this.state.currentBlockchain}
          amount={this.state.currentAmount}
          onConnect={this.handleConnect}
          onPageChangedClicked={this.handleLinkClicked}
        ></NavbarSimple>

        <div className="container-fluid">
          <div className="row flex-nowrap">
            <MainpageSelector
              onPageChangedClicked={this.handleLinkClicked}
              curPage={this.state.currentpage}
              connectStatus={this.state.connectStatus}
              onClaim = {this.ClaimTransaction}
              RewardsAmountEstimated = {this.state.estimatedReward}
              web3 = {this.state.theweb3}
              account={this.state.currentAccount}
            ></MainpageSelector>
          </div>
        </div>
      </div>
      //</Router>
    );
  }
}

export default Main;
