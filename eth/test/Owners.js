const Owners = artifacts.require("Owners");

contract('Owners', (accounts) => {

  // Ensures that the contract is initialized correctly and the desired accounts are set as owners
  it('should initialize with the right owners', async () => {
    const ownersInstance = await Owners.deployed();
    const owner1 = accounts[0];
    const owner2 = accounts[1];

    var bool1 = await ownersInstance.isOwner.call(accounts[0]);
    var bool2 = await ownersInstance.isOwner.call(accounts[1]);
    var bool3 = await ownersInstance.isOwner.call(accounts[2]);
    var bool4 = await ownersInstance.isOwner.call(accounts[5]);
    
    // Checks that accounts[5] was not incorrectly added as owner
    assert.equal(bool4, false, "Unregistered address should not be owner");

    // Checks that accounts[0] and accounts[1] were correctly added as owners
    assert.equal(bool1 * bool2 * bool3, true, "Owners initialized correctly");
  });

  // Ensures that the creator is also set as an owner
  it('should make the contract creator an owner', async () => {
    const ownersInstance = await Owners.deployed();
    const creator = accounts[0];

    var bool = await ownersInstance.isOwner.call(accounts[0]);

    assert.equal(bool, true, "Creator is owner");
  });
  
  // Tests a key functionality - voting to add an address
  // Contract should compute valid votes 
  it('should register a vote to add owner', async () => {
    const ownersInstance = await Owners.deployed();
    await ownersInstance.voteToAdd(accounts[5], {from: accounts[0]});

    var computedVote = await ownersInstance.hasVotedToAdd.call(accounts[0], accounts[5]);

    assert.equal(computedVote, true, "Vote added");
  });

  // Tests a key functionality - voting to remove an address
  // Contract should compute valid votes 
  it('should register a vote to remove owner', async () => {
    const ownersInstance = await Owners.deployed();
    await ownersInstance.voteToRemove(accounts[1], {from: accounts[0]});

    var computedVote = await ownersInstance.hasVotedToRemove.call(accounts[0], accounts[1]);

    assert.equal(computedVote, true, "Vote added");
  });

  // Checks that an owner is successfully added if simple majority is reached
  // The election process is the essence of this contract, hence its operation must be tested
  it('should add an owner with simple majority', async () => {
    const ownersInstance = await Owners.deployed();
    await ownersInstance.voteToAdd(accounts[6], {from: accounts[0]});
    await ownersInstance.voteToAdd(accounts[6], {from: accounts[1]});

    var bool = await ownersInstance.isOwner.call(accounts[6]);

    assert.equal(bool, true, "Owner added");
  });

    // Checks that an owner is successfully removed if simple majority is reached
    it('should remove an owner with simple majority', async () => {
      const ownersInstance = await Owners.deployed();

      await ownersInstance.voteToRemove(accounts[6], {from: accounts[0]});
      await ownersInstance.voteToRemove(accounts[6], {from: accounts[1]});

      var bool = await ownersInstance.isOwner.call(accounts[6]);
  
      assert.equal(bool, false, "Owner removed");
    });

});
