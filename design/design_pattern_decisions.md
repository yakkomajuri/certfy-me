# Design Pattern Decisions

## Upgradability

A proxy pattern is used to allow for upgradability of Certfy's main functionalities, included in the DocumentRegistration contract. The proxy contract was built by myself inspired by the Gnosis Safe proxy contract. It is coordinated by an Owners contract and explicitly stores its two initial variables (Owners contract address and DocumentRegistration contract address) at the last slots in storage to prevent clashes with the other contract's variables. 

Ideally, the storage of the contract would remain untouched, with only the Logic being updated. Hence, Logic inherits from Storage to ensure that subsequent contract versions can always inherit from the same Storage implementation. 

The choice to use an upgradable pattern has its shortcomings, but its coordination by the Owners contract should provide greater reassurance to the user. The goal is to allow the platform to improve and fix any bugs that may occur while preserving all data previously stored, a characteristic necessary for a notary. Given that multiple new features should be onboarded in the future, the choice for upgradability over rigidity was an essential one.

For the Proxy contract, see *~/eth/contracts/Proxy.sol*.


## Ownership

In order to coordinate the restricted functionalities of the contracts, an Owners contract was designed with fluidity in mind. Since all contracts required some sort of ownership functionalities, instead of using individual implementations, one Owners contract was deployed separately to be used by all contracts. 

This contract uses a 'Fluid Consensus' model, where by the group of owners is under a constant state of election, able to add and remove an owner at any time through a simple majority. By using this model, owners can be entrusted to act on their powers without relying on others through a multi-signature approach. Thus, changes can be made faster, at a lower cost and prevent issues associated with addresses becoming temporarily or permanently unavailable. This comes at the expense of full consensus for changes. However, if an owner performs an action that the rest of the owners disagree with, they can remove that address with ease and fix any undesirable updates that were performed. This model is also useful for contracts coordinated by one individual only, who can add various of his own addresses and not need to sign from more than one to get changes done. 

To make use of the functionality, contracts use the following modifier:

```
modifier onlyOwners() {
    require(ownerContract.getOwners(msg.sender));
    _;
}
```

The modifier uses opcode `CALL` to check with the separately-deployed contract if `msg.sender` is a designated owner.


## Circuit Breaker

A Circuit Breaker implementation is used to prevent certain functions from the contracts from being used in case of an emergency. It uses a `modifier` *stopInCaseOfEmergency* which will prevent the functions using it from being called if boolean *emergency* is set to `true`.


## ETH Rejector

Contracts *DocumentRegistration* and *CertfyToken* are equipped with a fallback function which prevents ETH from being locked within them. The function uses the common implementation:

```function() external payable { revert(); }```

## No Ether Storage (almost)

In order to make the process of gathering fees from the platform as simple and secure as possible, Certfy was originally built entirely with Ether-less contracts. ETH coming in as payment would immediately be transferred to an address. This allows for greater security, but is subject to payments being made to an address that becomes unavailable. The recepient address can always be changed, but there is a risk of funds being lost between the time access is lost and the change takes effect. Nevertheless, this choice was made to prevent the contract from becoming a target for hacks and fully shielding it from the possibility of funds being stolen.

However, with the addition of *CertfyToken* and *FeePool*, 50% of the funds are sent directly to the specified address whereas the other 50% are sent to the *FeePool* contract. Thus, mechanisms needed to be put in place to secure the *FeePool* contract, which stores ETH. This is described in more detail on *avoiding_common_attacks.md*.

## Modularity

A choice was made for a modular rather than monolithic project. The choice was a straightforward one, as the project contains multiple distinct parts which clearly coordinate separate functionalities. This facilitates upgrades, code maintenance and robustness, as a bug found in one contract will not necessarily require that all other contracts be redployed. The smart contracts are separated as follows:

### DocumentRegistration

Handles the main functionalities of the platform. Most importantly it handles the registration and authentication of documents.

### Proxy

Used for adding upgradability to *DocumentRegistration*. Uses the `DELEGATECALL` opcode to pass forward the relevant function calls it receives to the current updated version of the *DocumentRegistration* contract.

### Owners

One separate contract which coordinates all calls to restricted functions to all other contracts. Implements a Fluid Consensus model.

### CertfyToken

ERC777 token used to reward users of the Certfy platform.

### FeePool

A pool of ETH from fees paid by document registrants which is distributed to holders of Certfy tokens via dividends.

## On-chain Authentication

Parts of the *DocumentRegistration* contract could be designed off-chain, to optimize for gas costs. An example is the `verifyDocument()` function, which would not be necessary if the information about the documents was pulled and the hashes compared client-side. However, the choice to add this on-chain was to limit the power of the application to cheat the user, as well as allow the user to easily verify their document using third-party services like MyEtherWallet with as little work as possible (i.e. without having to manually create a way to compare hashes).

## Dividend Withdrawal

In order to optimize for gas on the *FeePool* contract, dividends are not distributed automatically, but rather they are allocated to each user who can then withdraw them during a specified period. This prevents the application from looping through a large array of addresses while sending a transfer to each one. This also prevents DoS and reentrancy attacks.



