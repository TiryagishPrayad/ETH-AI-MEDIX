require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY],
    },
  },
  paths: {
    artifacts: "./web4/src/artifacts",
  },
};
