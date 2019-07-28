# Certfy

## About

Certfy is a blockchain-based one-stop shop for creating, managing, storing and authenticating documents. Built with a strong focus on trustlessness and modularity, the platform acts as a facilitator of the interaction between its users and the Ethereum chain, rather than an intermediary. 

Certfy's features:

1. **Simple authentication**: Verification of the authenticity of any file type.
2. **Multi-signature registration**: Create a record of multiple parties attesting to the registration of a file/document. 
3. **Friends**: Add friends to create multi-sig registrations by using human-readable usernames rather than Ethereum addresses.
4. **Templates**: Users can create documents using Certfy's own templates or upload their own for simple creation later.
5. **IPFS Document Storage**: A user can choose to have a document encrypted and stored on IPFS.
6. **Certfy Token**: An ERC-777 token that cannot be purchased via crowdsale. The token is given to those who use use Certfy and entitles them to a portion of the transaction fees of the platform.
7. **Upgradability**: Certfy uses a proxy implementation to ensure persistency of important storage while allowing for upgrades to the platform.

## Project Structure

**/eth**

This directory contains all the Solidity smart contracts. It is a truffle project allowing for simple deploying and local testing of the contracts.

**/website**

Contains all the files referring to the Certfy website.

**/design**

Contains the files *design_pattern_decisions.md* and *avoiding_common_attacks.md* which explain key aspects of the design and architecture of the project.

