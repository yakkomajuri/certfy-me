
const CertfyToken = artifacts.require("CertfyToken");
const Owners = artifacts.require("Owners");
const DocumentRegistration = artifacts.require("DocumentRegistration");
const FeePool = artifacts.require("FeePool");


contract('CertfyToken', (accounts) => {

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


    it('should give selected amount of tokens to the creator', async () => {
        const tokenContract = await CertfyToken.deployed();
    
        var balance = await tokenContract.balanceOf.call(accounts[0]);

        assert.equal(balance, 100, "Creator received 100 tokens");
    });


    it('should allow a token transfer', async () => {
        const tokenContract = await CertfyToken.deployed();

        var valueToSend = 10;
    
        await tokenContract.transfer(accounts[3], valueToSend, {from: accounts[0]});
        
        var balanceSender = await tokenContract.balanceOf.call(accounts[0]);
        var balanceReceiver = await tokenContract.balanceOf.call(accounts[3]);


        assert.equal(balanceSender.toNumber(), 100-valueToSend, "Sender balance decreased");
        assert.equal(balanceReceiver.toNumber(), valueToSend, "Receiver balance increased");
    });


});

