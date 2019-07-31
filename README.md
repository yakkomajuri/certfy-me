# Certfy

![Certfy Logo](https://github.com/yakkomajuri/bootcamp-finalproject/blob/master/assets/logo.png?raw=true)


## About

Certfy is a blockchain-based one-stop shop for creating, managing, storing and authenticating documents. Built with a strong focus on trustlessness and modularity, the platform acts as a facilitator of the interaction between its users and the Ethereum chain, rather than an intermediary. 

The aim of Certfy is to act as a digital notary, helping cut down costs of registering and authenticating documents, a necessity for Intellectual Property and contracts, for example. While it focuses primarily on documents, it can authenticate any type of file, from *.pdf* to *.mp3*. Additionally, Certfy aims to provide a service that encompasses the full lifecycle of a document, making use of an intuitive UX and feature-rich dashboard to allow users to also create and store documents in a simple and trustless way.

Certfy's features:

1. **Simple authentication**: Verification of the authenticity of any file type.
2. **Multi-signature registration**: Create a record of multiple parties attesting to the registration of a file/document. 
3. **Friends**: Add friends to create multi-sig registrations by using human-readable usernames rather than Ethereum addresses.
4. **Templates**: Users can create documents using Certfy's own templates or upload their own for simple creation later.
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

4. Recommended: run `truffle migrate --reset --all` before tests.

5. Run `truffle test`

The reasoning for each test is provided via comments in the file where the test was written.

## Using Certfy

Important: Certfy requires MetaMask to function.

To use Certfy's most trivial functionalities users need not login. By clicking 'Begin' on the homepage users will be taken to the bottom of the page where they can create a simple document registration to be able to authenticate the file. The file's authenticity can then be verified by clicking 'Verify' on the Navbar.

In order to unlock more features, users can then register on the platform. Upon login, they are taken to a User Dashboard where they have an overview of all their registered documents as well as are able to add friends, create multi-sig registrations, use templates and IPFS, etc.

## Tutorial 

**Step 1: MetaMask**

In order to use Certfy the recommended way, you will need the MetaMask extension, or an equivalent Web3-compatible (dApp) browser.
MetaMask and alternatives provide a gateway for users to interact with EVM-based blockchain protocols (primarily Ethereum, but also ThunderCore and RSK, for example). They allow users to sign transactions and send ether (ETH) directly, without going through an intermediary. MetaMask is a browser extension, and without it, a webpage will either not be able to interact with the blockchain, or will have to do that connection for you, which is less secure for the end user.

To download MetaMask, go to https://metamask.io/.
Then, launch the extension on your browser and follow the instructions to set-up a wallet. There we go! You’re now ready to continue.

**Step 2: Getting Ether**

For the purposes of this tutorial, we will use Ethereum’s Ropsten network so that you can test the platform without using any real money. You will actually register a document and manage to authenticate it, but Ropsten is a test network that should not be used in production. 
To get Ropsten Ether, open your MetaMask extension and copy your address by clicking on the account name. It should say “Copy to clipboard” if you hover your cursor over it.
After copying the address, head over to the following website: https://faucet.ropsten.be/.
On the website, paste the address and request some RETH. It should shortly arrive in your account. Once you have it, we’re ready to start our registration.

**Step 3: Registration**

First, access the homepage at *localhost:80*.

Then, click on “Begin” or scroll to the bottom of the page. You should see the following:

Once you’re here, it’s pretty self-explanatory. Make sure you switch the MetaMask network to Ropsten, where you have your Ether, and you’re good to go.

Fill in the fields accordingly and hit Register. Description is optional, and in fact, so is uploading a file. You could register just text if you wish.

After clicking the button to “Register”, your MetaMask should have automatically opened up on the screen. If it hasn’t, you can also click on the extension to see your transaction. 

The “Total” will vary depending on how much data you’re registering and what gas price you’re using. If gas price doesn’t mean anything to you, just hit confirm. If it does, you’re welcome to play around with it.

Having hit Confirm, a progress bar should have appeared on the website. Once the transaction is included in a block, the bar should stop moving and you should receive an index for your registration. This index is often just 0 and is used together with the title of your registration to retrieve it, so make sure you write both down! If you don’t want to write down those details for every document you register, you should create an account. If you’re logged in, Certfy saves the title and index for you and you don’t have to worry about it. It will also display all your registrations in one place and allow you to easily verify their data and check the authenticity of documents against them.

**Step 4: Verifying authenticity**

If you got an index on the previous step, congratulations! You now have a file/document/piece of text registered on the blockchain. Now, let’s put it to use. Head over to “Verify” on the top right corner. You should see the following page:

Here you can play around a bit and see what results you get. First, type in the exact title and index of your registration, uploading the same file as you did in the previous step. Clicking “Verify” should prompt a response of “The documents match”.
(If you didn’t upload a file, this step is of no use to you, but if you log-in, you can retrieve the information you registered).
Uploading any other file or changing anything on the title or index should give you a different response: “The documents do not match or the wrong information was supplied”.

And there you have it! Your first blockchain document registration and authentication. If you like it, create an account and see what else you can do on the platform. If you use the same address, you should see the document you registered upon logging in. Crazy, right? That’s because the platform is pulling the data associated with your address directly from the chain, not the database. Hence, even registrations you made before being a user on the platform will appear on your Dashboard. 

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
- Password reset functionality
- Updates to frontend and backend
- README.md, avoiding_common_attacks.md, design_pattern_decisions.md

P.S. *DocumentRegistration*, *Proxy* and *Owners* contracts are successfully integrated with the frontend, while *CertfyToken* and *FeePool* are not. The reason for this was that once *DocumentRegistration* was updated to make calls to *FeePool* and *CertfyToken* it no longer worked with the proxy implementation, since a CALL cannot be made after a DELEGATECALL. 





