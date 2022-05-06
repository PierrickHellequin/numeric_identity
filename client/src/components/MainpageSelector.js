
import React, { Component } from "react";
import Mainpage from "./Mainpage";
import RewardsComp from "./RewardsComp";
import Admin from "./admin";

class MainpageSelector extends Component {




    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(linkNumber,propNumber) {
        //e.preventDefault();
       // console.log(linkNumber);
        this.props.onPageChangedClicked(linkNumber,propNumber);
    }
   

    componentDidMount = async () => {

    };


    render() {

       
    
        if (this.props.curPage === 0) {
           
            return (
               
                <Mainpage/>
            );

        }
        else if (this.props.curPage === 1) {
            return (
                <RewardsComp onClaim = {this.props.onClaim} RewardsAmountEstimated= {this.props.RewardsAmountEstimated} />
            );

        }
        else if (this.props.curPage === 2) {
            return (
                <Admin/>
            );

        }

    }
}

export default MainpageSelector;
