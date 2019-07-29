const DocumentRegistration = artifacts.require("DocumentRegistration");
const Owners = artifacts.require("Owners");
// const Proxy = artifacts.require("Proxy");
// const CertfyToken = artifacts.require("CertfyToken");
// const FeePool = artifacts.require("FeePool");


module.exports = function(deployer) {
    deployer.deploy(Owners, "0xb879a27bafe8f8dc7cee7bf6270c24f827809c01", "0x8e716ac6410123ce9aaa19fe1307cf62fc26f9d3").then(function() {
        // return deployer.deploy(DocumentRegistration, Owners.address);
        return deployer.deploy(DocumentRegistration);
      });
};
