const Postcard = artifacts.require("Postcard");

module.exports = function(deployer) {
  deployer.deploy(Postcard);
};
