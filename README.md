# Certfy

![Certfy Logo](https://raw.githubusercontent.com/yakkomajuri/bootcamp-finalproject/assets/logo.png)


## About

Certfy is a blockchain-based one-stop shop for creating, managing, storing and authenticating documents. Built with a strong focus on trustlessness and modularity, the platform acts as a facilitator of the interaction between its users and the Ethereum chain, rather than an intermediary. 

The aim of Certfy is to act as a digital notary, helping cut down costs of registering and authenticating documents, a necessity for Intellectual Property and contracts, for example. While it focuses primarily on documents, it can authenticate any type of file, from *.pdf* to *.mp3*. Additionally, Certfy aims to provide a service that encompasses the full lifecycle of a document, making use of an intuitive UX and feature-rich dashboard to allow users to also create and store documents in a simple and trustless way.

Certfy's features:

1. **Simple authentication**: Verification of the authenticity of any file type.
2. **Multi-signature registration**: Create a record of multiple parties attesting to the registration of a file/document. 
3. **Friends**: Add friends to create multi-sig registrations by using human-readable usernames rather than Ethereum addresses.
4. **Templates**: Users can create documents using Certfy's own templates or upload their own for simple creation later.
5. **IPFS Document Storage**: A user can choose to have a document encrypted and stored on IPFS.
6. **Certfy Token**: An ERC-777 token that cannot be purchased via crowdsale. The token is given to those who use use Certfy and entitles them to a portion of the transaction fees of the platform.
7. **Upgradability**: Certfy uses a proxy implementation to ensure persistency of important storage while allowing for upgrades to the platform.
8. **Ethereum login**: Instead of having to always input username and password, users can login directly using their Ethereum address. The address is pulled from MetaMask automatically if the extension is unlocked.

## Project Structure

**/eth**

This directory contains all the Solidity smart contracts. It is a truffle project allowing for simple deploying and local testing of the contracts.

**/website**

Contains all the files referring to the Certfy website.

**/design**

Contains the files *design_pattern_decisions.md* and *avoiding_common_attacks.md* which explain key aspects of the design and architecture of the project.

**deployed_addresses.txt** 

Contains the addresses of deployed contracts and their respective networks.

## Getting started

If you wish to try out Certfy in your local machine, do the following on a Terminal/Shell:

1. Clone this repository

`git clone https://github.com/yakkomajuri/bootcamp-finalproject`

2. Install dependencies

Navigate to ./website and run:

`npm install` 

3. Install and configure MongoDB

If you do not already have MongoDB installed, use homebrew to install it:

`brew install mongodb`

Then, run `mongod` to start the daemon and on a new terminal window run `mongo` to use the shell.

On the shell, do the following:

```
use certfy
db.createCollection('users')
```

You can check that this was successful with commands `show dbs` and `show collections`.

4. Start a local server

To start a local server run:

`npm start`

This will start a server with *nodemon* running on port 80. You can change the default port on *website/www/bin*.

5. Use Certfy

In the browser of your choice, navigate to *localhost* to access the Certfy platform.

## Running tests

To run the tests written for the Solidity smart contracts, do the following after cloning the repository:

1. Navigate to *./eth*

2. Ensure you have truffle installed or run `npm i -g truffle` to install it

3. Use *ganache-cli* or another provider of your choice to start a local Ethereum network. By default, the project will look for connections on port 8545. You can change this on *truffle-config.js*.

4. Recommended: run `truffle migrate --reset` before tests.

5. Run `truffle test`

## Using Certfy

Important: Certfy requires MetaMask to function.

To use Certfy's most trivial functionalities users need not login. By clicking 'Begin' on the homepage users will be taken to the bottom of the page where they can create a simple document registration to be able to authenticate the file. The file's authenticity can then be verified by clicking 'Verify' on the Navbar.

In order to unlock more features, users can then register on the platform. Upon login, they are taken to a User Dashboard where they have an overview of all their registered documents as well as are able to add friends, create multi-sig registrations, use templates and IPFS, etc.

## Disclaimer

This project was built **entirely by myself**. However, it was started prior to the beginning of the Bootcamp. For full disclosure, here is a breakdown of what was done before and what was done during the course.

**Before**

- Frontend
- Backend structure
- *DocumentRegistration* contract
- *Proxy* contract
- *Owners* contract
- Web3.js integration for the aforementioned contracts
- Deployment to Ropsten testnet

**During**

- *CertfyToken* contract
- *FeePool* contract
- Significant changes to *DocumentRegistration* contract
- Significant changes to *Owners* contract
- Integration of all 5 contracts as communicating parts of one project
- Restructuring of contracts to comply with Solidity Style Guide
- Commenting of all contracts according to NatSpec Format
- Truffle tests for all contracts
- Redeployment to Ropsten testnet
- IPFS integration
- Password reset functionality
- Updates to frontend and backend
- Certfy logo and Medium page
- README.md, avoiding_common_attacks.md, design_pattern_decisions.md






