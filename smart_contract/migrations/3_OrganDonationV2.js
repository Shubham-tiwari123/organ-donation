// 2_deploy_contracts.js
const UserRegistry = artifacts.require('UserRegistry');
const OrganDonation = artifacts.require('OrganDonation');
const IOTData = artifacts.require('IOTData');

module.exports = async function (deployer) {
  // Deploy UserRegistry contract
  await deployer.deploy(UserRegistry);
  const userRegistryInstance = await UserRegistry.deployed();

  // Deploy OrganDonation contract and pass the address of UserRegistry contract
  await deployer.deploy(OrganDonation, userRegistryInstance.address);
  const organDonationInstance = await OrganDonation.deployed();

  // Deploy IOTData contract and pass the address of OrganDonation contract
  await deployer.deploy(IOTData, organDonationInstance.address);
  const iotDataInstance = await IOTData.deployed();
};