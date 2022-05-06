
import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";


import Menu from './Menu';
import NavbarSimple from './NavbarSimple';
import MainpageSelector from "./MainpageSelector";
import getWeb3Click from "../getWeb3";

//Load components
// import Navigation from "./components/Navbar";
// import Home from "./components/Home";
// import Admin from "./components/admin";
// import Defi from "./components/protocole";
// import LoadUser from "./components/usersData";



// contracts
import IdRewarder from "../contracts/IdFundedRewarder.json";


// css
import "./appstyle.css";
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
            estimatedReward: 0

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

        this.loadWeb3();




    };

    loadWeb3 = async () => {

        console.log("running loadweb3");

        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3Click();
            console.log(web3);

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();

            if ((web3.currentProvider != null) && (web3.eth.net != null)) {
                const networkId = await web3.eth.net.getId();

                const deployedNetwork = IdRewarder.networks[networkId];

                if (deployedNetwork != null) {
                    const instance = new web3.eth.Contract(
                        IdRewarder.abi,
                        deployedNetwork && deployedNetwork.address,
                    );

                    //var instance = null;

                    const bal = await web3.eth.getBalance(accounts[0]);
                    var chainname = "undefined";
                    if (networkId === 1)
                        chainname = "mainnet";
                    if (networkId === 5777)
                        chainname = "ganache";
                    if (networkId === 42)
                        chainname = "kovan";
                    // TODO: others networks ?
                    var balEther = web3.utils.fromWei(bal, 'ether');

                    // contract should be dployed here

                    this.setState({
                        currentAccount: accounts[0].toString(), currentAmount: balEther.toString(),
                        currentBlockchain: chainname,
                        connectStatus: 1, theweb3: web3, theaccounts: accounts, rewarderContract: instance
                    }, this.runInit);

                    console.log("contract found");
                }
            }
            else {
                this.setState({
                    currentAccount: accounts[0].toString(), currentAmount: balEther.toString(),
                    currentBlockchain: chainname,
                    connectStatus: 2, theweb3: web3, theaccounts: accounts, thecontract: null
                });
                console.log("contract not found");
            }


            window.ethereum.on('accountsChanged', (accounts) => {
                this.accountChanged(accounts);
            });

            window.ethereum.on('chainChanged', (chainId) => {
                // Handle the new chain.
                // Correctly handling chain changes can be complicated.
                // We recommend reloading the page unless you have good reason not to.

                this.reload();
            });


        }
        catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );

            this.reload();
        }
    };



    async accountChanged(newaccounts) {
        console.log('accountsChanges', newaccounts);

        await this.loadWeb3();
    }



    updateEstimatedReward = async () => {

        const contract = this.state.rewarderContract;
        const accounts = this.state.theaccounts;
        if (accounts != null) {
          const result = await contract.methods.EstimateRewardForAddress(this.state.currentAccount).call();

          const rewards = result;
          const isreg = await contract.methods.IsRegisteredAdress(this.state.currentAccount).call();
          if (isreg)
          {
            console.log(this.state.currentAccount+" registered");
          }
          else
          {
            console.log(this.state.currentAccount+" not registered");
          }
        

          this.setState({ estimatedReward: rewards });
        }
        console.log("update estimated rewards");
    }

    ClaimTransaction = async () => {

      

        const contract = this.state.rewarderContract;

        try {
          await contract.methods.Claim().send({ from: this.state.currentAccount });



          this.runInit();
        }
        catch (error) {

          console.log(error);
        }
    }



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
                <div class="container-fluid">
                    <div class="row flex-nowrap">
                        <div class="col bg-color1"><NavbarSimple
                            connectStatus={this.state.connectStatus}
                            account={this.state.currentAccount}
                            blockchain={this.state.currentBlockchain}
                            amount={this.state.currentAmount}
                            onConnect={this.handleConnect}></NavbarSimple></div>
                    </div>
                    <div class="row flex-nowrap">
                        {/* <div class="col-sm-3 bg-color2">  */}
                        <div class="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
                            <Menu onLinkClicked={this.handleLinkClicked}></Menu>
                        </div>
                        <div class="col-sm-9 bg-color3">
                            <div class="container p-5 my-5">
                                <MainpageSelector
                                    onPageChangedClicked={this.handleLinkClicked}
                                    curPage={this.state.currentpage}
                                    connectStatus={this.state.connectStatus}
                                    RewardsAmountEstimated = {this.state.estimatedReward}
                                    onClaim = {this.ClaimTransaction}
                                >
                                </MainpageSelector>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            //</Router>

        );
    }
}

export default Main;
