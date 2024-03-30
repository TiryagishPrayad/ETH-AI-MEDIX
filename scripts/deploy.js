const { ethers } = require("hardhat");

async function main() {
  const Upload = await ethers.getContractFactory("Upload");
  const etherTransfer = await Upload.deploy();

  console.log("Upload deployed to:", etherTransfer.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
