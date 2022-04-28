// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./IdModificationListener.sol";

// rqs:
// - struct person to be precised
// - onlyOwner for now but should be multi sig (hospital, town hall)

// TODO:
// - events
// - requires
// - list of listeners, unbounded loop issue
contract MyPropertyContract is Ownable 
{


    struct Person 
    {
        address ethAddress;
        string name;
        // birthdate
        // name
        // parents
        // physical adress
        // id --> be careful to duplicates!
        // etc...
       
    }


    // struct ListenerIndex 
    // {
    //     uint index;
    //     bool isValid;
       
    // }
    // IdModificationListener[] listeners;
    // mapping(address => ListenerIndex) listenersIndex;

    IdModificationListener listener; 
    function AddId(string memory name, address ethAdress) public onlyOwner
    {
        // call listeners

    }

    function SetDeadId(string memory name) public onlyOwner
    {
        // call listeners
    }

    function UpdateId(string memory name, address ethAdress) public onlyOwner
    {
        // call listeners
    }

    function SetListener(address contractAddress) public onlyOwner
    {
        listener = IdModificationListener(contractAddress);
    }

    // function AddListener(address listenerAdress) public onlyOwner
    // {
    //     IdModificationListener newListener = IdModificationListener(listenerAdress);
    //     listeners.push(newListener);
    //     listenersIndex[listenerAdress] = ListenerIndex(listeners.length - 1,true);

    // }
    // function removeListener(address listenerAdress) public onlyOwner
    // {
    //     uint index = listenersIndex[listenerAdress].index;
    //     bool isValid = listenersIndex[listenerAdress].isValid;

    //     require(isValid);

    //     // put last here
    //     listeners[index] = listeners[listeners.length - 1];
    //     firstArray.pop();

    //     address movedAddress = listeners[index;

    //     // update mapping
    //     listenersIndex[movedAddress].index = index;

    // }


}