const { ethers } = require('hardhat');

async function main() {
  const accounts = await ethers.getSigners();

  console.log('Deploying contracts with account:', accounts[0].address);

  const UserRegistry = await ethers.deployContract("UserRegistry");
  const userRegistry = await UserRegistry.waitForDeployment();
  console.log("UserRegistry deployed to:", userRegistry.target);

  const OrganDonation = await ethers.deployContract("OrganDonation", [userRegistry.target]);
  const organDonation = await OrganDonation.waitForDeployment();
  console.log("OrganDonation deployed to:", organDonation.target);

  const IOTData = await ethers.deployContract("IOTData", [organDonation.target]);
  const iOTData = await IOTData.waitForDeployment();
  console.log("IOTData deployed to:", iOTData.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
