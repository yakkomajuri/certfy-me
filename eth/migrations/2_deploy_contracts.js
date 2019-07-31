const DocumentRegistration = artifacts.require("DocumentRegistration");
const Owners = artifacts.require("Owners");
const CertfyToken = artifacts.require("CertfyToken");
const FeePool = artifacts.require("FeePool");


module.exports = function (deployer, network, accounts) {
  // deployer.deploy(FeePool, );
  deployer.deploy(Owners, [accounts[1], accounts[2]]).then(function () {
    deployer.deploy(FeePool);
    deployer.deploy(DocumentRegistration);
    return deployer.deploy(CertfyToken, "Certfy Token", "CERT", 100, [accounts[0]], Owners.address);
  });
};
