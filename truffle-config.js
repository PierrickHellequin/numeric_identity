const HDWalletProvider = require('@truffle/hdwallet-provider');
const PrivateKeyProvider = require("truffle-privatekey-provider");
const path = require("path");
require('dotenv').config();

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port:8545,            // Standard Ethereum port (default: none)
      network_id: "5777",       // Any network (default: none)
    },
    kovan: {
      provider: function() {
        return new HDWalletProvider(`${process.env.MNEMONIC}`, `https://kovan.infura.io/v3/${process.env.INFURA_ID}`)
      },
      network_id: 42
    },
    rinkeby: {
      provider: function() {
        //return new HDWalletProvider(`${process.env.MNEMONIC}`, `https://rinkeby.infura.io/v3/${process.env.INFURA_ID}`)
        return new PrivateKeyProvider(process.env.PKEY, `https://rinkeby.infura.io/v3/${process.env.INFURA_ID}`);

      },
      network_id: 4
    }
  },

  compilers: {
    solc: {
      version: "0.8.14",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
        enabled: false,
        runs: 200
        },
      evmVersion: "byzantium"
      }
    },
  }
};
