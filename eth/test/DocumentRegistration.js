const DocumentRegistration = artifacts.require("DocumentRegistration");

contract('DocumentRegistration', (accounts) => {
    /*
    beforeEach(async () => {
        ContractInstance = await erc20token.new("MyStoreFront")
        assert.ok(ContractInstance)
    
        erc20factoryInstance = await erc20factory.new()
        await ContractInstance.setParent(erc20factoryInstance.address)
    })
    */


    it('should set the right address for Owners contract', async () => {
      const docReg = await DocumentRegistration.deployed();

      var pretendOwnersAddress = accounts[9];

      await docReg.setOwnersContract(pretendOwnersAddress, {from: accounts[0]});
  
      var registeredAddress = await docReg.ownerContract.call();
  
      assert.equal(registeredAddress, pretendOwnersAddress, "Owners address set correctly");
    });

    it('should set the right address for Token contract', async () => {
        const docReg = await DocumentRegistration.deployed();
  
        var pretendTokenAddress = accounts[8];
  
        await docReg.setTokenContract(pretendTokenAddress, {from: accounts[0]});
    
        var tokenAddress = await docReg.tokenContract.call();
    
        assert.equal(tokenAddress, pretendTokenAddress, "Token address set correctly");
      });

      it('should set the prices correctly', async () => {
        const docReg = await DocumentRegistration.deployed();
  
        var pricesArray = [10, 10, 10, 10];
  
        await docReg.setPrices(pricesArray, {from: accounts[0]});
    
        var price0 = await docReg.prices.call(0);
        var price1 = await docReg.prices.call(1);
        var price2 = await docReg.prices.call(2);
        var price3 = await docReg.prices.call(3);

    
        assert.equal(pricesArray[0], price0, "Price 0 set correctly");
        assert.equal(pricesArray[1], price1, "Price 1 set correctly");
        assert.equal(pricesArray[2], price2, "Price 2 set correctly");
        assert.equal(pricesArray[3], price3, "Price 3 set correctly");

      });


      it('should register a document', async () => {
        const docReg = await DocumentRegistration.deployed();
  
        var docName = "My Document";
        var docDescription = "My first document, yay!";
        var fileHash = "0x085ac69a7929a5f4cd510b499c633c8025833fb75bfc7dbf6376443763d49bf0";

        await docReg.setPoolContract(accounts[9], {from: accounts[0]});
        await docReg.setCurrent(accounts[9], {from: accounts[0]});
        await docReg.registerDocument(docName, docDescription, fileHash, {from: accounts[1], value: 10});
    
        var document = await docReg.documents.call(0);


    
        assert.equal(document[0], docName, "Name set correctly");
        assert.equal(document[1], docDescription, "Description set correctly");
        assert.equal(String(web3.utils.toHex(document[5])), fileHash, "Hash set correctly");

      });

  
  });

