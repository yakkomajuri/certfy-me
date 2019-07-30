pragma solidity^0.5.0;

/**
 * @title Owners
 * @author Yakko Majuri
 * @notice A fluid consensus model to coordinate all restricted functions in Certfy's contracts
 * @notice Owners are in a constant state of election
*/

contract Owners {

    // Keeps track of all owners
    mapping(address => bool) public isOwner;

    // Keeps track of who each address voted for
    mapping(address => mapping(address => bool)) public hasVotedToAdd;
    mapping(address => mapping(address => bool)) public hasVotedToRemove;

    // Keeps track of the number of votes an address has received (to be added or removed)
    mapping(address => uint8) public votesToAdd;
    mapping(address => uint8) public votesToRemove;

    /// @notice Keeps track of all addresses that an owner has voted for. 
    /// @dev Once the array reaches 25 addresses the address must remove a vote before voting again
    /// This is used to allow for an iterable store of addresses that is used to remove
    /// all votes from a specific address if the address is removed from its position as owner
    mapping(address => address[]) addressesVotedOn;

    /// How many addresses are currently owners
    uint8 public numberOfVoters;
    
    // Restricts certain functions to owners only
    modifier onlyOwners() {  
        require(isOwner[msg.sender]);
        _;
    }
    

    /** 
     * @notice Establishes the first 'owner' addresses
     * @dev Ensures that number of voters corresponds to the number of 
     * distinct addresses in _owners array
    */
    constructor(address[] memory _owners) public {
        isOwner[msg.sender] = true;
        for (uint i = 0; i < _owners.length; i++) {
            if (!isOwner[_owners[i]]) {
                isOwner[_owners[i]] = true;
                numberOfVoters++;
            }
        }
    }
    
    /** 
     * @notice Owners can vote to add new owners
     * @param _ad Address to be voted on
     * @dev Check if address has already voted to add that specific address
     * @dev Check if address voting is an owner
     * @dev Check if address receiving vote is not an owner
     * @dev Check if simple majority was reached after every vote and add address if 
     * majority reached
    */
    function voteToAdd(address _ad) public onlyOwners {
        require(addressesVotedOn[msg.sender].length < 26);
        require(hasVotedToAdd[msg.sender][_ad] == false,
        "this");
        require(isOwner[_ad] == false,
        "that");
        hasVotedToAdd[msg.sender][_ad] = true;
        addressesVotedOn[msg.sender].push(_ad);
        votesToAdd[_ad]++;
        enoughVotesToAdd(_ad);
    }
    
    /** 
     * @notice Owners can vote to remove new owners
     * @param _ad Address to be voted on
     * @dev Check if address has already voted to add that specific address
     * @dev Check if address voting is an owner
     * @dev Check if address receiving vote is an owner
     * @dev Check if simple majority was reached after every vote and remove address if 
     * majority reached
    */
    function voteToRemove(address _ad) public onlyOwners {
        require(addressesVotedOn[msg.sender].length < 26);
        require(hasVotedToRemove[msg.sender][_ad] == false);
        require(isOwner[_ad]);
        hasVotedToRemove[msg.sender][_ad] = true;
        addressesVotedOn[msg.sender].push(_ad);
        votesToRemove[_ad]++;
        enoughVotesToRemove(_ad);
    } 
    
    /** 
     * @notice The "Change your Mind" function
     * @notice Allows users to turn back on their decision and remove a specific vote
     * @param _ad Address to remove vote for
     * @param _choice 0 to remove vote to add address, 1 to remove vote to remove
    */
    function removeMyVote(address _ad, uint8 _choice) public onlyOwners {
        require(_choice < 2);
        if (_choice == 0) {
            require(hasVotedToAdd[msg.sender][_ad]);
            hasVotedToAdd[msg.sender][_ad] = false;
            votesToAdd[_ad]--;
        }
        if (_choice == 1) {
            require(hasVotedToRemove[msg.sender][_ad]);
            hasVotedToRemove[msg.sender][_ad] = false;
            votesToRemove[_ad]--;
        }
    }
    
    /** 
     * @notice Internal function called after every voteToAdd function call
     * @notice If enough votes (simple majority) are reached, add address as owner
    */
    function enoughVotesToAdd(address _ad) internal {
        if (votesToAdd[_ad] * 2 > numberOfVoters) {
            numberOfVoters += 1;
            isOwner[_ad] = true;
        }
    }
    
    /** 
     * @notice Internal function called after every voteToRemove function call
     * @notice If enough votes (simple majority) are reached, remove address as owner
    */
    function enoughVotesToRemove(address _ad) internal {
        if (votesToRemove[_ad] * 2 > numberOfVoters) {
            numberOfVoters -= 1;
            isOwner[_ad] = false;
            removeOwnerVotes(_ad);
        }
        else { }
    }
    
    /** 
     * @notice Tells if address _ad is owner
     * @param _ad Any address
     * @return Boolean specifying if _ad is owner
    */
    function getOwners(address _ad) external view returns(bool) {
        return isOwner[_ad];
    }
    
    
    /** 
     * @notice Removes all votes from a removed owner
     * @dev Iterates through all addresses the owner voted on and removes the votes
    */
    function removeOwnerVotes(address _ad) internal {
        address a;
        for (uint i = 0; i < addressesVotedOn[_ad].length; i++) {
            a = addressesVotedOn[_ad][i];
            if (hasVotedToRemove[_ad][a]) {
                votesToRemove[a]--;
            }
            if (hasVotedToAdd[_ad][a]){
                votesToAdd[a]--;
            }
        }
    }
    
}
