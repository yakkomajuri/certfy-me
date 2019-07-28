

function waitAndSet() {
setTimeout(function() {
DocumentRegistration.allEvents({
    fromBlock: latest
}, (error, event) => { 
	var index = (event.args.index).toNumber();
	running = false;
	document.getElementById('myProgress').style.visibility = 'hidden';
	document.getElementById('myBar').style.visibility = 'hidden';
	document.getElementById('event').innerHTML = "Your registration's index number is: <b>" + index + 
	"</b>. This number is used along with your document's name to find your registered information. Write them both down or <a href='/users/login' style='border-bottom: 0.5px dashed; display: inline;'>login</a> so we take care of that for you next time.";
	console.log(index); 
	document.getElementById('evtInd').value = index;
	document.getElementById('regt').value = web3.utils.toChecksumAddress(document.getElementById('hiding').innerText);
	document.getElementById('mtit').value = document.getElementById('title').value;
	$("#sigModal").modal();
});
}, 1000);

}

waitAndSet();