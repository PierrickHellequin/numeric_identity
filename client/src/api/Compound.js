import Web3 from "web3";
import Compound from "@compound-finance/compound-js";
import { abiJson } from "./AbiJson.js";

let provider = window.ethereum;
const web3 = new Web3(provider);
var compound = new Compound(window.ethereum);

//const contractAddress = "0xd6801a1DfFCd0a410336Ef88DeF4320D6DF1883e";
// cdai adress on rinkeby
const contractAddress = "0x6D7F0754FFeb405d23C51CE938289d4835bE3b14";

const cDaiContract = new web3.eth.Contract(abiJson, contractAddress);

export async function getMyAccount() {
  const data = await web3.eth.getAccounts();
  return data[0];
}

export async function getSupplyAPY() {
  const supplyRate = await cDaiContract.methods.supplyRatePerBlock().call();
  const blockperday = 4 * 60 * 24;
  return (((supplyRate / 10 ** 18) * blockperday + 1) ** 365 - 1) * 100;
}

export async function getTotalSupply() {
  const tokens = await cDaiContract.methods.totalSupply().call();
  return tokens / 10 ** 8;
}

export async function getExchangeRate() {
  const exchangeRate = await cDaiContract.methods.exchangeRateCurrent().call();
  return exchangeRate / Math.pow(10, 18 + 18 - 8);
}

export async function getMySupply(acc) {
  const balanceOfUnderlying =
    web3.utils.toBN(
      await cDaiContract.methods.balanceOfUnderlying(acc).call()
    ) /
    10 ** 18;
  return balanceOfUnderlying;
}

export async function getCTokenBalance(acc) {
  const cTokenBalance = await cDaiContract.methods.balanceOf(acc).call();
  return cTokenBalance / 10 ** 8;
}

export async function mintTokens(account, amount,daiContract) {
  // const mint = await cDaiContract.methods.mint().send({
  //   from: account,
  //   value: web3.utils.toHex(web3.utils.toWei(eth, "ether")),
  // });
  // return mint;

  //await compound.supply(Compound.Dai, web3.utils.toWei(eth, "ether").toString());

  // approve dai here TMP TODO
 
 
  await daiContract.methods.approve(contractAddress,web3.utils.toWei(amount, "ether")).send({ from: account });




  const mint = await cDaiContract.methods.mint(web3.utils.toWei(amount, "ether")).send({
    from: account,
    value:0
    
  });
  return mint;
}

export async function withdrawToken(account, cDai) {
  const withdraw = await cDaiContract.methods.redeem(cDai * 10 ** 8).send({
    from: account,
  });
  return withdraw;
}
