// Import the smart contracts you want to deploy
const UserRegistry = artifacts.require('UserRegistry');
const OrganDonation = artifacts.require('OrganDonation');

module.exports = function (deployer) {
  // Deploy UserRegistry contract
  deployer
    .deploy(UserRegistry)
    .then(() => {
      // Once UserRegistry is deployed, deploy OrganDonation contract and pass the address of UserRegistry
      return deployer.deploy(OrganDonation, UserRegistry.address);
    })
    .catch((error) => {
      console.error('Error deploying contracts:', error);
    });
};
