// const Postcard = artifacts.require("Postcard");
const Souvenir = artifacts.require("Souvenir");

module.exports = function(deployer) {
  deployer.deploy(Souvenir);
};
