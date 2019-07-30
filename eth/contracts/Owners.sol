pragma solidity^0.5.0;

/** 
 * @title Owners
 * @author Yakko Majuri
 * @notice A fluid consensus model to coordinate all restricted functions in Certfy's contracts
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
    
    // Keeps track of all addresses that have been voted on. Once the 
    address[] public addressesVotedOn;

    uint8 public numberOfVoters;
    
    modifier onlyOwners() {  
        require(isOwner[msg.sender]);
        _;
    }
    

    constructor(address _owner1, address _owner2) public {
        isOwner[msg.sender] = true;
        isOwner[_owner1] = true;
        isOwner[_owner2] = true;
        numberOfVoters = 3;
    }
    
    function voteToAdd(address _ad) public onlyOwners {
        require(hasVotedToAdd[msg.sender][_ad] == false,
        "this");
        require(isOwner[_ad] == false,
        "that");
        hasVotedToAdd[msg.sender][_ad] = true;
        if (votesToAdd[_ad] == uint8(0)) {
            addressesVotedOn.push(_ad);
        if (addressesVotedOn.length == 15) {
                reset();
            }
        }
        votesToAdd[_ad]++;
        enoughVotesToAdd(_ad);
    }
    
    function voteToRemove(address _ad) public onlyOwners {
        require(hasVotedToRemove[msg.sender][_ad] == false);
        require(isOwner[_ad]);
        hasVotedToRemove[msg.sender][_ad] = true;
        if (votesToRemove[_ad] == uint8(0)) {
            addressesVotedOn.push(_ad);
        if (addressesVotedOn.length == 15) {
                reset();
            }
        }
        votesToRemove[_ad]++;
        enoughVotesToRemove(_ad);
    } 
    
    function removeMyVote(address _ad, uint8 _choice) public onlyOwners {
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
    
    function enoughVotesToAdd(address _ad) internal {
        if (votesToAdd[_ad] * 2 > numberOfVoters) {
            numberOfVoters += 1;
            isOwner[_ad] = true;
        }
        else { }
    }
    
    function enoughVotesToRemove(address _ad) internal {
        if (votesToRemove[_ad] * 2 > numberOfVoters) {
            numberOfVoters -= 1;
            isOwner[_ad] = false;
            removeOwnerVotes(_ad);
        }
        else { }
    }
    
    function getOwners(address _ad) external view returns(bool) {
        return isOwner[_ad];
    }
    
    
    function reset() internal {
        for (uint i = 0; i < addressesVotedOn.length; i++) {
            votesToAdd[addressesVotedOn[i]] = 0;
            votesToRemove[addressesVotedOn[i]] = 0;
            delete addressesVotedOn[i];
        }
    }
    
    function removeOwnerVotes(address _ad) internal {
        address a;
        for (uint i = 0; i < addressesVotedOn.length; i++) {
            a = addressesVotedOn[i];
            if (hasVotedToRemove[_ad][a]) {
                votesToRemove[a]--;
            }
            if (hasVotedToAdd[_ad][a]){
                votesToAdd[a]--;
            }
        }
    }
    
}
