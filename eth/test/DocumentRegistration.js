const DocumentRegistration = artifacts.require("DocumentRegistration");
const CertfyToken = artifacts.require("CertfyToken");
const Owners = artifacts.require("Owners");
const FeePool = artifacts.require("FeePool");

contract('DocumentRegistration', (accounts) => {

    // 'DocumentRegistration' regularly interacts with 'Owners', so this initialization is essential
    it('should set the right address for Owners contract', async () => {
      const docReg = await DocumentRegistration.deployed();
      const ownersContract = await Owners.deployed();
  
      await docReg.setOwnersContract(ownersContract['address'], {from: accounts[0]});
      var registeredAddress = await docReg.ownerContract.call();
  
      assert.equal(registeredAddress, ownersContract['address'], "Owners address set correctly");
    });

    // 'DocumentRegistration' regularly interacts with 'CertfyToken', so this initialization is essential
    it('should set the right address for Token contract', async () => {
      const docReg = await DocumentRegistration.deployed();
      const tokenContract = await CertfyToken.deployed();

      await docReg.setTokenContract(tokenContract['address'], {from: accounts[0]});
    
        var tokenAddress = await docReg.tokenContract.call();
    
        assert.equal(tokenAddress, tokenContract['address'], "Token address set correctly");
      });

    // 'DocumentRegistration' regularely interacts with 'CertfyToken', so this initialization is essential
      it('should set the right addresses for address(current) and FeePool', async () => {
        const docReg = await DocumentRegistration.deployed();
        const tokenContract = await CertfyToken.deployed();
        const feePoolContract = await FeePool.deployed();

  
        await docReg.setCurrent(accounts[0], {from: accounts[0]});
        await docReg.setPoolContract(feePoolContract['address'], {from: accounts[0]});

        var current = await docReg.current.call();
        var feePool = await docReg.feePoolContract.call();

          assert.equal(current, accounts[0], "Current address set correctly");
          assert.equal(feePool, feePoolContract['address'], "FeePool address set correctly");
        });

      // Prices determine the cost for every action on the platform, so must be set correctly
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

      // Tests key functionality
      // Given that the right amount is paid, document should be able to be registered by anyone
      // If tx.value is changed, execution should revert - Try it for yourself!
      it('should register a document', async () => {
        const docReg = await DocumentRegistration.deployed();
        const tokenContract = await CertfyToken.deployed();

        await tokenContract.setDocumentRegistration(docReg['address'], {from: accounts[0]});

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


      // Tests key functionality
      // Given that the right amount is paid, document should be able to be registered to the temporary registry
      // Then, if the correct signee calls signDocument() and transfers the right value document is added to real document registry
      // If msg.sender for signDocument != signee2 transaction should revert - Try it for yourself!
      // If tx.value is changed, execution should revert - Try it for yourself!
      it('should register a multisig document', async () => {
        const docReg = await DocumentRegistration.deployed();
  
        var docName = "My Multi-Sig";
        var docDescription = "My first multi-sig, yay!";
        var fileHash = "0x085ac69a7929a5f4cd510b499c633c8025833fb75bfc7dbf6376443763d49bf0";

        var signee1 = accounts[3];
        var signee2 = accounts[4];

        var price = await docReg.prices.call(2);

        var tx1 = await docReg.registerMultiSig(docName, docDescription, fileHash, signee2, {from: signee1, value: price/2});
        var tempIndex = tx1['logs'][0]['args']['index'];

        var tx2 = await docReg.signDocument(docName, tempIndex, {from: signee2, value: price/2});
        var index = tx2['logs'][0]['args']['index'];

        var document = await docReg.documentQuery.call(docName, index);


    
        assert.equal(document[0], docDescription, "Name set correctly");
        assert.equal(document[2], signee1, "Registrant set correctly");
        assert.equal(document[3], signee2, "Signee set correctly");

      });

      // Tests key functionality
      // Given that the right amount is paid, address should be registered as a verifiedAddress
      // If tx.value is changed, execution should revert - Try it for yourself!
      // This test tests for verifiedAddress[_address].isEntity == true
      it('should successfully register an address as a verifiedAddress', async () => {
        const docReg = await DocumentRegistration.deployed();


        var name = "Company A";
        var description = "companywebsite.com/our-eth-address";

        await docReg.registerAddress(name, description, {from: accounts[9], value: 10});
       
        var addressInfo = await docReg.verifiedAddress.call(accounts[9]);

        assert.equal(addressInfo[3], true, "Address registered correctly");

      });
  
  });

