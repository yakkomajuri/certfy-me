const CertfyToken = artifacts.require("CertfyToken");
const Owners = artifacts.require("Owners");
const DocumentRegistration = artifacts.require("DocumentRegistration");
const FeePool = artifacts.require("FeePool");


contract('FeePool', (accounts) => {

    // Used to verify intialization
    // The contract constantly interacts with CertfyToken, so it is important that this information is correct
    it('should set the token address & supply', async () => {
        const feePoolContract = await FeePool.deployed();
        const tokenContract = await CertfyToken.deployed();

        await feePoolContract.setToken(tokenContract['address'], 1000000, {from: accounts[0]});

        var tokenAddress = await feePoolContract.token.call();
        var tokenSupply = await feePoolContract.tokenSupply.call();


        assert.equal(tokenAddress, tokenContract['address'], "Token address set correctly");
        assert.equal(tokenSupply.toNumber(), 1000000, "Total supply set correctly");

    });

    // Key functionality of the contract - Accounting for received ETH via the fallback function
    // This makes up the pool which will be distributed as dividends
    // ETH not accounted for would be lost ETH
    it('should account for received ether', async () => {
        const feePoolContract = await FeePool.deployed();

        await web3.eth.sendTransaction({    
            from: accounts[0],
            to: feePoolContract['address'],
            value: '1000000000000000'
        });

        await feePoolContract.incrementPool({from: accounts[0]});

        var pool = await feePoolContract.currentPool.call();

        assert.equal(pool.toNumber(), 1000000000000000, "Pool updated correctly");

    });

    // Ensures that dividend payout can be activated by any address
    it('should activate dividend payout', async () => {
        const feePoolContract = await FeePool.deployed();
        const tokenContract = await CertfyToken.deployed();

        await feePoolContract.activatePayout({from: accounts[8]});


        var activated = await feePoolContract.payoutInSession.call();

        assert.equal(activated, true, "Dividend payout started successfully");

    });
    
    // Ensures that ETH goes to the correct pool (current vs. next)
    it('should increment nextPool if payout is in session', async () => {
        const feePoolContract = await FeePool.deployed();

        await web3.eth.sendTransaction({    
            from: accounts[0],
            to: feePoolContract['address'],
            value: '1000000000000000'
        });

        await feePoolContract.incrementPool({from: accounts[0]});

        var current = await feePoolContract.currentPool.call();
        var next = await feePoolContract.nextPool.call();

        assert.equal(current.toNumber(), 1000000000000000, "Current pool did not increase");
        assert.equal(next.toNumber(), 1000000000000000, "Next pool updated correctly");
    });

    // After time has passed, the payout period should be able to be closed by any address
    it('should close dividend payout period', async () => {
        const feePoolContract = await FeePool.deployed();

        await feePoolContract.endPayoutPeriod({from: accounts[7]});


        var activated = await feePoolContract.payoutInSession.call();

        assert.equal(activated, false, "Dividend payout period ended successfully");

    });

});


