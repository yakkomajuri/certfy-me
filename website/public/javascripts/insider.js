web3.eth.defaultAccount = web3.eth.accounts[0];

account = web3.eth.accounts[0];

// INSTANTIATE CONTRACT AND ABI

var DocumentRegistrationContract = web3.eth.contract([
	{
		"constant": false,
		"inputs": [
			{
				"name": "_name",
				"type": "string"
			},
			{
				"name": "_description",
				"type": "string"
			}
		],
		"name": "registerAddress",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_name",
				"type": "string"
			},
			{
				"name": "_metadata",
				"type": "string"
			},
			{
				"name": "_fileHash",
				"type": "bytes32"
			}
		],
		"name": "registerDocument",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_name",
				"type": "string"
			},
			{
				"name": "_metadata",
				"type": "string"
			},
			{
				"name": "_fileHash",
				"type": "bytes32"
			},
			{
				"name": "_signee",
				"type": "address"
			}
		],
		"name": "registerMultiSig",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_current",
				"type": "address"
			}
		],
		"name": "setCurrent",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_ownerContract",
				"type": "address"
			}
		],
		"name": "setOwnerContract",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_index",
				"type": "uint8"
			},
			{
				"name": "_price",
				"type": "uint128"
			}
		],
		"name": "setPrice",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_price1",
				"type": "uint128"
			},
			{
				"name": "_price2",
				"type": "uint128"
			},
			{
				"name": "_price3",
				"type": "uint128"
			},
			{
				"name": "_price4",
				"type": "uint128"
			}
		],
		"name": "setPrices",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_name",
				"type": "string"
			},
			{
				"name": "_temporaryIndex",
				"type": "uint32"
			}
		],
		"name": "signDocument",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_name",
				"type": "string"
			},
			{
				"name": "_description",
				"type": "string"
			}
		],
		"name": "updateInfo",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "DocumentIndex",
		"type": "event"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_name",
				"type": "string"
			},
			{
				"name": "_index",
				"type": "uint32"
			}
		],
		"name": "checkTemporary",
		"outputs": [
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "current",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "docsPerUser",
		"outputs": [
			{
				"name": "",
				"type": "uint32"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_name",
				"type": "string"
			},
			{
				"name": "_nameIndex",
				"type": "uint32"
			}
		],
		"name": "documentQuery",
		"outputs": [
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "documents",
		"outputs": [
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "metadata",
				"type": "string"
			},
			{
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"name": "registrant",
				"type": "address"
			},
			{
				"name": "signee",
				"type": "address"
			},
			{
				"name": "hash",
				"type": "bytes32"
			},
			{
				"name": "isEntity",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "prices",
		"outputs": [
			{
				"name": "",
				"type": "uint128"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "registrants",
		"outputs": [
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "description",
				"type": "string"
			},
			{
				"name": "user",
				"type": "address"
			},
			{
				"name": "isEntity",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "registry",
		"outputs": [
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "metadata",
				"type": "string"
			},
			{
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"name": "registrant",
				"type": "address"
			},
			{
				"name": "signee",
				"type": "address"
			},
			{
				"name": "hash",
				"type": "bytes32"
			},
			{
				"name": "isEntity",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "temporaryDocs",
		"outputs": [
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "metadata",
				"type": "string"
			},
			{
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"name": "registrant",
				"type": "address"
			},
			{
				"name": "signee",
				"type": "address"
			},
			{
				"name": "hash",
				"type": "bytes32"
			},
			{
				"name": "isEntity",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "temporaryRegistry",
		"outputs": [
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "metadata",
				"type": "string"
			},
			{
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"name": "registrant",
				"type": "address"
			},
			{
				"name": "signee",
				"type": "address"
			},
			{
				"name": "hash",
				"type": "bytes32"
			},
			{
				"name": "isEntity",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "uint32"
			}
		],
		"name": "userDocs",
		"outputs": [
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "metadata",
				"type": "string"
			},
			{
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"name": "registrant",
				"type": "address"
			},
			{
				"name": "signee",
				"type": "address"
			},
			{
				"name": "hash",
				"type": "bytes32"
			},
			{
				"name": "isEntity",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "verifiedAddress",
		"outputs": [
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "description",
				"type": "string"
			},
			{
				"name": "user",
				"type": "address"
			},
			{
				"name": "isEntity",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_name",
				"type": "string"
			},
			{
				"name": "_nameIndex",
				"type": "uint32"
			},
			{
				"name": "_fileHash",
				"type": "bytes32"
			}
		],
		"name": "verifyDocument",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]);


var prices = [0, 0, 0, 0];
var running = true;
const latest = web3.eth.getBlockNumber();

var rsk = DocumentRegistrationContract.at('0xcf27d55931623144d2BABE6a0889b97d14cA4330')
, thunder = DocumentRegistrationContract.at('0x46dcf24835d099f933b18de574753e38bffe911d')
, ropsten = DocumentRegistrationContract.at('0xa4f8e93b09c7164dc42187dbd8eabc86066755fd');

var config = ethereum.networkVersion;

function initialize() {
	setContract();
if (config == 108) {
	contractAddress = '0x46dcf24835d099f933b18de574753e38bffe911d';
	document.getElementById('network').innerHTML = "Thunder (Mainnet)";
}
else if (config == 30) {
	contractAddress = '0xcf27d55931623144d2BABE6a0889b97d14cA4330';
	document.getElementById('network').innerHTML = "RSK (Mainnet)";
}
else if (config == 3) {
	contractAddress = '0xa4f8e93b09c7164dc42187dbd8eabc86066755fd';
	document.getElementById('network').innerHTML = "Ethereum (Ropsten)";
}
else {
	document.getElementById('network').innerHTML = "[UNDEFINED] Please re-configure your MetaMask."
}
}

function setContract() {
	setTimeout(function(){
	console.log("contract set for network");
	DocumentRegistration = DocumentRegistrationContract.at(contractAddress);
	awaitAndSet();
}, 500);
}



function registerDoc(name, metadata, fileHash) {
	checkPrice(1);
	sleep(200);
    var tx = DocumentRegistration.registerDocument(name, metadata, fileHash, {
        from: account,
        // gas: "3000000",
        to: contractAddress,
        value: prices[1],
        data: ""
    }, function (err, transactionHash) {
        if (!err)
			console.log(transactionHash);
			document.getElementById('myProgress').style.visibility = 'visible';
			document.getElementById('myBar').style.visibility = 'visible';
			move();
			document.getElementById('event').innerHTML = "Waiting for your transaction to be included in a block..."
    }
    )
};

function registerMulti(name, metadata, fileHash, signee) {
	checkPrice(2);
	sleep(200);
    var tx = DocumentRegistration.registerMultiSig(name, metadata, fileHash, signee, {
        from: account,
        // gas: "3000000",
        to: contractAddress,
        value: prices[2] / 2,
        data: ""
    }, function (err, transactionHash) {
        if (!err)
			console.log(transactionHash);
			document.getElementById('myProgress').style.visibility = 'visible';
			document.getElementById('myBar').style.visibility = 'visible';
			move();
			document.getElementById('event').innerHTML = "Waiting for your transaction to be included in a block..."
    }
    )
};


thunder.allEvents({
    fromBlock: latest
}, (error, event) => { 
	if(contractAddress == '0x46dcf24835d099f933b18de574753e38bffe911d') {
		var index = (event.args.index).toNumber();
		running = false;
		document.getElementById('myProgress').style.visibility = 'hidden';
		document.getElementById('myBar').style.visibility = 'hidden';
		document.getElementById('event').innerHTML = "Your registration's index number is: <b>" + index + 
		"</b>. This number is used along with your document's name to find your registered information. We suggest you write both down but we will store them for you just in case.";
		if (document.getElementById('multi').value) {
			document.getElementById('eventIndex').value = index;
			document.getElementById('m_title').value = document.getElementById('title').value;
			document.getElementById('eth_address').value = web3.toChecksumAddress(document.getElementById('multi').value);
			$("#multiModal").modal();
		}
		else if (document.getElementById('multi').value == "" && document.getElementById('title').value){
			document.getElementById('evtInd').value = index;
			document.getElementById('mtit').value = document.getElementById('title').value;
			$("#stdModal").modal();
		}
	} else {}
});

rsk.allEvents({
    fromBlock: latest
}, (error, event) => { 
	if(contractAddress == '0xcf27d55931623144d2BABE6a0889b97d14cA4330') {
		var index = (event.args.index).toNumber();
		running = false;
		document.getElementById('myProgress').style.visibility = 'hidden';
		document.getElementById('myBar').style.visibility = 'hidden';
		document.getElementById('event').innerHTML = "Your registration's index number is: <b>" + index + 
		"</b>. This number is used along with your document's name to find your registered information. We suggest you write both down but we will store them for you just in case.";
		if (document.getElementById('multi').value) {
			document.getElementById('eventIndex').value = index;
			document.getElementById('m_title').value = document.getElementById('title').value;
			document.getElementById('eth_address').value = web3.toChecksumAddress(document.getElementById('multi').value);
			$("#multiModal").modal();
		}
		else if (document.getElementById('multi').value == "" && document.getElementById('title').value){
			document.getElementById('evtInd').value = index;
			document.getElementById('mtit').value = document.getElementById('title').value;
			$("#stdModal").modal();
		}
	} else {}
});

ropsten.allEvents({
    fromBlock: latest
}, (error, event) => { 
	if(contractAddress == '0xa4f8e93b09c7164dc42187dbd8eabc86066755fd') {
		var index = (event.args.index).toNumber();
		running = false;
		document.getElementById('myProgress').style.visibility = 'hidden';
		document.getElementById('myBar').style.visibility = 'hidden';
		document.getElementById('event').innerHTML = "Your registration's index number is: <b>" + index + 
		"</b>. This number is used along with your document's name to find your registered information. We suggest you write both down but we will store them for you just in case.";
		if (document.getElementById('multi').value) {
			document.getElementById('eventIndex').value = index;
			document.getElementById('m_title').value = document.getElementById('title').value;
			document.getElementById('eth_address').value = web3.toChecksumAddress(document.getElementById('multi').value);
			$("#multiModal").modal();
		}
		else if (document.getElementById('multi').value == "" && document.getElementById('title').value){
			document.getElementById('evtInd').value = index;
			document.getElementById('mtit').value = document.getElementById('title').value;
			$("#stdModal").modal();
		}
	 }
	  else {}
});


  function checkPrice(index) {
    DocumentRegistration.prices(index, (error, data) => {
        prices[index] = data.toNumber();
    });
}
function awaitAndSet() {
	setTimeout(function(){
		getPrices();
	}, 500);
}

async function getPrices() {
	await checkPrice(1);
	await checkPrice(2);
	document.getElementById('stdPrice').innerHTML = " " + prices[1] + " ETH";
	document.getElementById('multiPrice').innerHTML = " " + prices[2] + " ETH";
}


function move() {
	var elem = document.getElementById("myBar"); 
	var width = 1;
	var id = setInterval(frame, 30);
	function frame() {
	  if (width >= 100 && running) {
		clearInterval(id);
		width = 1;
		move();
	  } else if (running) {
		width++; 
		elem.style.width = width + '%'; 
	  }
	  else if (running == false) {
		elem.style.width = 100 + '%'; 
	  }
	}
  }

  function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
  }

  initialize();