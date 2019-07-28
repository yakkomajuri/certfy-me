var config = ethereum.networkVersion;
var friends = true;

function initialize() {
if (config == 108) {
	document.getElementById('network').innerHTML = "Thunder (Mainnet)";
}
else if (config == 30) {
	document.getElementById('network').innerHTML = "RSK (Mainnet)";
}
else if (config == 3) {
	document.getElementById('network').innerHTML = "Ethereum (Ropsten)";
}
else {
	document.getElementById('network').innerHTML = "[UNDEFINED] Please re-configure your MetaMask."
}
}

async function submitForm(id) {
    var num = id;
    console.log(id);
    console.log(10000+num);
    var element = await document.getElementById(1000+num);
    console.log(element);
    await  element.setAttribute('name', 'signee');
    document.friendsForm.submit();
}

var element;

function subForm(id) {
    var requestId;
    if(id[2] && id[3]) {
        requestId = id[1] + id[2] + id[3];
    }
    else if(id[2]) {
        requestId = id[1] + id[2];
    }
    else if (id[1]) {
        requestId = id[1];
    }
    console.log(requestId);
    element = document.getElementById(requestId).value;
    document.getElementById('modal1').value = element;
}

function prepareRemoval(id) {
    var requestId;
    if(id[2] && id[3]) {
        requestId = id[1] + id[2] + id[3];
    }
    else if(id[2]) {
        requestId = id[1] + id[2];
    }
    else if (id[1]) {
        requestId = id[1];
    }
    console.log(requestId);
    element = document.getElementById(requestId).value;
    document.getElementById('modal2').value = element;
}




var userToRemove;

async function prepareRemoval(id) {

}

initialize();