
const CertfyToken = artifacts.require("CertfyToken");
const Owners = artifacts.require("Owners");
const DocumentRegistration = artifacts.require("DocumentRegistration");
const FeePool = artifacts.require("FeePool");


contract('CertfyToken', (accounts) => {
    /*
    beforeEach(async () => {
        ContractInstance = await erc20token.new("MyStoreFront")
        assert.ok(ContractInstance)
    
        erc20factoryInstance = await erc20factory.new()
        await ContractInstance.setParent(erc20factoryInstance.address)
    })
    */



    it('should create a token with the right parameters', async () => {
        const tokenContract = await CertfyToken.deployed();

        var name = await tokenContract.name.call();
        var symbol = await tokenContract.symbol.call();
        var supply = await tokenContract.totalSupply.call();


        assert.equal(name, "Certfy Token", "Name set correctly");
        assert.equal(symbol, "CERT", "Symbol set correctly");
        assert.equal(supply, 10000000, "Total supply set correctly");

    });

    it('should set the right owners contract', async () => {
        const tokenContract = await CertfyToken.deployed();
        const ownersContract = await Owners.deployed();

        var ownersAddress = await tokenContract.ownersContract.call();


     
        assert.equal(ownersAddress, ownersContract['address'], "Owners address set sucessfully");

    });

    it('should set the right FeePool and DocumentRegistration addresses', async () => {
        const tokenContract = await CertfyToken.deployed();
        const docRegContract = await DocumentRegistration.deployed();
        const feePoolContract = await FeePool.deployed();

        await feePoolContract.setToken(tokenContract['address'], 1000000, {from: accounts[0]});

        await tokenContract.setPoolAddress(feePoolContract['address'], {from: accounts[0]});
        await tokenContract.setDocumentRegistration(docRegContract['address'], {from: accounts[0]});

        var feePoolAddress = await tokenContract.feePoolAddress.call();
        var docRegAddress = await tokenContract.documentRegistrationAddress.call();


     
        assert.equal(feePoolAddress, feePoolContract['address'], "FeePool address set sucessfully");
        assert.equal(docRegAddress, docRegContract['address'], "DocumentRegistration address set sucessfully");

    });


    it('should give 1000 tokens to a user who registers a document', async () => {
        const tokenContract = await CertfyToken.deployed();
        const docRegContract = await DocumentRegistration.deployed();
        const feePoolContract = await FeePool.deployed();

        await feePoolContract.setToken(tokenContract['address'], 1000000, {from: accounts[0]});

        await tokenContract.setPoolAddress(feePoolContract['address'], {from: accounts[0]});
        await tokenContract.setDocumentRegistration(docRegContract['address'], {from: accounts[0]});

        var feePoolAddress = await tokenContract.feePoolAddress.call();
        var docRegAddress = await tokenContract.documentRegistrationAddress.call();


     
        assert.equal(feePoolAddress, feePoolContract['address'], "FeePool address set sucessfully");
        assert.equal(docRegAddress, docRegContract['address'], "DocumentRegistration address set sucessfully");

    });

});

