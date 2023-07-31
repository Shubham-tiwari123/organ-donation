const UserRegistry = artifacts.require('UserRegistry');

contract(UserRegistry, (accounts) => {
  let userRegistry;

  beforeEach(async () => {
    userRegistry = await UserRegistry.new();
  });
});
