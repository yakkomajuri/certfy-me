pragma solidity^0.5.0;


/** 
 * @title Proxy
 * @author Yakko Majuri
 * @notice A proxy implementation to allow for smart contract upgradability
*/

// Owners contract coordinates who can update the 'implementation' address
contract Owners {

    function getOwners(address _ad) public view returns(bool) {}

}

/// @notice Proxy contract delegates (almost) all calls to the application smart contract
contract Proxy {

    /// @notice Determines address of Owners Contract
    constructor(address _ownerContract) public payable {
        assembly {
            /// @dev Store address at penultimate slot of storage stack to prevent collisions
            sstore(0xfffffffffffffffffffffffffffffffffffffffe, _ownerContract)
        }
    }
    
    /// @notice Set the contract to receive the delegated call
    function setImplementation(address _impl) public {
        address cont;
        Owners ownerContract;
        assembly {
            /// @dev Loads address of Owners contract from storage
            cont := sload(0xfffffffffffffffffffffffffffffffffffffffe)
        }
        ownerContract = Owners(cont);
        /// @dev Checks that the msg.sender is a desginated owner in Owners contract
        require(ownerContract.getOwners(msg.sender));
        assembly {
            /// @dev Store implementation at last slot of storage stack
            sstore(0xffffffffffffffffffffffffffffffffffffffff, _impl)
        }
    }

    /// @notice Fallback function - Delegates call
    function () external payable {
        address localImpl;
        assembly {
            /// @dev Loads implementation address from storage
            localImpl := sload(0xffffffffffffffffffffffffffffffffffffffff)
        }
        assembly {
            let ptr := mload(0x40)
            /// @dev Copies all data used to call the contract
            calldatacopy(ptr, 0, calldatasize)
            /// @dev Calls implementation contract and assigns the result to var 'result'
            let result := delegatecall(gas, localImpl, ptr, calldatasize, 0, 0)
            let size := returndatasize
            
            /// @dev Copies return data and stores it in Proxy contract
            returndatacopy(ptr, 0, size)
            switch result
            case 0 { revert(ptr, size) }
            default { return(ptr, size) }
        }
    }

    /// @notice Informs what the current implementation address is
    /// @return Returns address of current version of DocumentRegistration contract
    function getImplementation() public view returns(address) {
        address implementation;
        assembly {
            /// @notice Load implementation from its storage slot
           implementation := sload(0xffffffffffffffffffffffffffffffffffffffff)
        }
        return implementation;
    }

}
