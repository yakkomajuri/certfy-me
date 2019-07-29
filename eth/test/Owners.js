const Owners = artifacts.require("Owners");

contract('Owners', (accounts) => {
  it('should initialize with the right owners', async () => {
    const ownersInstance = await Owners.deployed();
    const owner1 = accounts[0];
    const owner2 = accounts[1];

    var bool1 = await ownersInstance.isOwner.call(accounts[0]);
    var bool2 = await ownersInstance.isOwner.call(accounts[1]);

    assert.equal(bool1 * bool2, true, "Owners initialized correctly");
  });

  it('should make the contract creator an owner', async () => {
    const ownersInstance = await Owners.deployed();
    const creator = accounts[0];

    var bool = await ownersInstance.isOwner.call(accounts[0]);

    assert.equal(bool, true, "Creator is owner");
  });
  
  it('should register a vote to add owner', async () => {
    const ownersInstance = await Owners.deployed();
    await ownersInstance.voteToAdd(accounts[5], {from: accounts[0]});

    var computedVote = await ownersInstance.hasVotedToAdd.call(accounts[0], accounts[5]);

    assert.equal(computedVote, true, "Vote added");
  });

  it('should register a vote to remove owner', async () => {
    const ownersInstance = await Owners.deployed();
    await ownersInstance.voteToRemove(accounts[1], {from: accounts[0]});

    var computedVote = await ownersInstance.hasVotedToRemove.call(accounts[0], accounts[1]);

    assert.equal(computedVote, true, "Vote added");
  });

  it('should add an owner with simple majority', async () => {
    const ownersInstance = await Owners.deployed();
    await ownersInstance.voteToAdd(accounts[5], {from: accounts[1]});
    var majorityReached = await ownersInstance.isOwner.call(accounts[5]);
    if (!majorityReached) {
        await ownersInstance.voteToAdd(accounts[5], {from: accounts[0]});
    }
    
    var bool = await ownersInstance.isOwner.call(accounts[5]);

    assert.equal(bool, true, "Owner added");
  });

});
