import React, { Component } from "react"

import IdRewarder from "./contracts/IdRewarder.json";
//import erc20 from "./contracts/ERC20.json"
import getWeb3 from "./getWeb3";

import "./App.css";

//Load components
import Home from "./components/Home";
import Admin from "./components/admin";
import Defi from "./components/protocole";
import LoadUser from "./components/usersData";
import RewardsComp from "./components/RewardsComp";

class App extends Component {
  constructor(props) {
    super(props);



    this.state = {
      web3: null,
      accounts: null,
      contract: null,
      estimatedReward: 0
    };

    this.runInit = this.runInit.bind(this);
    this.updateEstimatedReward = this.updateEstimatedReward.bind(this);
  }
 

  componentDidMount = async () => {
   
    try {
     
      // Get network provider and web3 instance.
      const theweb3 = await getWeb3();
     
      // Use web3 to get the user's accounts.
      const theaccounts = await theweb3.eth.getAccounts();
     
      // Get the contract instance.
      const networkId = await theweb3.eth.net.getId();
      const deployedNetwork = IdRewarder.networks[networkId];
      const instance = new theweb3.eth.Contract(
        IdRewarder.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3: theweb3, accounts: theaccounts, contract: instance }, this.runInit);

      // EVENTS
      let options = {
        filter: {
          value: [],
        },
        fromBlock: 0
      };


      // console.log("registering events");
      // instance.events.StakeEvent(options).on('data', event => this.runInit());
      // instance.events.UnStakeEvent(options).on('data', event => this.runInit());
      // instance.events.ClaimEvent(options).on('data', event => this.runInit());




      // call method every 3 s
      this.interval = setInterval(this.updateEstimatedReward, 3000);

    }
    catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  componentWillUnmount() {
    // Clear the interval right before component unmount
    clearInterval(this.interval);
  }


  updateEstimatedReward = async () => {
    const { accounts, contract } = this.state;
    if (accounts != null) {
      const result = await contract.methods.EstimateRewardForAddress(accounts[0]).call();
     
      const rewards = result;

      this.setState({ estimatedReward: rewards });
    }
    console.log("update estimated rewards");
  }

  
  runInit = async () => {
    const { accounts, contract } = this.state;

    // recup estimation rewards
    this.updateEstimatedReward();

  };


  // **************** callbacks
  ClaimTransaction = async () => {
   
    const accounts = this.state.accounts;

    const contract = this.state.contract;
    
    try {
      await contract.methods.Claim().send({ from: accounts[0] });

      // DBG
      // var key = await contract.methods.GetKey().call({ from: accounts[0] });
      // this.setState({ estimatedReward: key });


      this.runInit();
    }
    catch (error) {
      
      console.log(error);
    }
  }

 


  

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Rewards</h1>
        <p>This is the rewards page.</p>


        <RewardsComp RewardsAmountEstimated={this.state.estimatedReward} onClaim={this.ClaimTransaction}></RewardsComp>
      </div>


    );
  }
}

export default App;
