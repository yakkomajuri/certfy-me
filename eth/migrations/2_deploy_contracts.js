const DocumentRegistration = artifacts.require("DocumentRegistration");
const Owners = artifacts.require("Owners");
const Proxy = artifacts.require("Proxy");
// const CertfyToken = artifacts.require("CertfyToken");
// const FeePool = artifacts.require("FeePool");


module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(MetaCoin);
};
