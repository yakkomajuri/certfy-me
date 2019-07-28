
var firstParty = [false];
var secondParty = [false];
var first, second;

function loadFields() {
  if (document.getElementById('sel').value == "Non-Disclosure Agreement (NDA)") {
      document.getElementById('docSpecificFields').innerHTML = '<h4> To see an example NDA, click <a href="../assets/pdf/nda.pdf" download="example-nda.pdf"> here. </a> </h4> <br> <br> <div class="form-check" id="test1"> <label class="form-check-label"> <input class="form-check-input" type="checkbox" id="party1"> Please check this box if the first signatory of the contract is a company (This should correspond to you). <span class="form-check-sign"> <span class="check"></span> </span> </label> <br> <br> <label class="form-check-label"> <input class="form-check-input" type="checkbox" id="party2"> Please check this box if the second signatory of the contract is a company. <span class="form-check-sign"> <span class="check"></span> </span> </label> </div><br><center> <button onclick="loadNDA(document.getElementById(\'party1\').checked, document.getElementById(\'party2\').checked)" class="btn btn-primary">Proceed to details</button></center></form>';
  }
}


function loadNDA(c1, c2) {
  if (c1) {
    first = C1;
    firstParty[0] = true;
  }
  else {
    first = I1;
  }
  if (c2) {
    second = C2;
    secondParty[0] = true;
  }
  else {
    second = I2;
  }
    var form = '<form><h4> Date</h4> <div class="form-group"> <input type="date" class="form-control" id="date" placeholder=""></div> <br><h4> Duration (in years) </h4> <div class="form-group"> <input type="number" class="form-control" id="term" placeholder="0" label="Term (years)"><br> </div> <h4> First signatory </h4>' + first + '<br><h4> Second signatory </h4>' + second + '</form><center><button class="btn btn-primary" onClick="generateNDA()">Generate NDA</button></center>';
    document.getElementById('docSpecificFields').innerHTML = form;
    console.log(c1, c2);
}

function generateNDA() {
  var date = document.getElementById("date").value;
  var term = document.getElementById("term").value;
  if(firstParty[0]) {
    firstParty.push(
      document.getElementById('cName1').value,
      document.getElementById('cCountry1').value,
      document.getElementById('cNumber1').value,
      document.getElementById('cAddress1').value
    );
  }
  else {
    firstParty.push(
      document.getElementById('iName1').value,
      document.getElementById('iAddress1').value
    );
  }
  if (secondParty[0]) {
    secondParty.push(
      document.getElementById('cName2').value,
      document.getElementById('cCountry2').value,
      document.getElementById('cNumber2').value,
      document.getElementById('cAddress2').value
    );
  }
  else {
    secondParty.push(
      document.getElementById('iName2').value,
      document.getElementById('iAddress2').value
    );
  }
  setParties(date, term);
}




var p1, p2, date, term;

function setParties(dt, duration) {
    date = dt;
    term = duration;
    if (firstParty[0]) {
      p1 = firstParty[1] + ", a company registered in " +  firstParty[2] + " under company number " + firstParty[3] + " whose registered office is at " +  firstParty[4]; 
    }
    else {
      p1 = firstParty[1] + ", a person whose principal place of residence is at " + firstParty[2] + ".";
    }
    if (secondParty[0]) {
      p2 = secondParty[1] + ", a company registered in " +  secondParty[2] + " under company number " + secondParty[3] + " whose registered office is at " +  secondParty[4] + "."; 
    }
    else {
      p2 = secondParty[1] + ", a person whose principal place of residence is at " + secondParty[2] + ".";
    }
    makeNDA();
}

var nda;

function makeNDA() {
  var parties = p1 + " and " + p2;
  nda = "<!DOCTYPE html><html><style>body {line-height:1.8em;} h2 {margin-right: 80px important! } </style><body> <h2> <span style='color:white;'> ....... </span>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Mutual Confidentiality and Non-Disclosure Agreement</h2> <p>This Mutual Confidentiality and Nondisclosure Agreement ('Agreement') is entered into on " + date + " by and between: " +  parties + "</p> <p>The parties are considering entering into a possible relationship or business venture which will involve the exchange of Confidential Information (as defined below) from the disclosing party (the 'Discloser') to the receiving party (the 'Recipient') relating thereto, as defined in Schedule 1 of this Agreement (the 'Project'). The terms of this Agreement relate to all such exchange of information relating to the Project. </p> <p> <b>1. Definition of Confidential Information.</b> The parties acknowledge that the following will be considered confidential ('Confidential Information'): (a) the terms and conditions of this Agreement; (b) the existence of the discussions between the parties and information concerning the Project; (c) information that is marked clearly as confidential or proprietary; (d) information that is designated as confidential or proprietary at the time of disclosure; or (e) information that, by its very nature, Recipient knows or should know is confidential, including without limitation the Discloser's strategic goals, product plans, customer information and lists, designs, costs, prices and names, finances, marketing plans, business opportunities, personnel, research, development or know-how. Confidential Information does not include information that: (1) is now or subsequently becomes generally available to the public through no fault or breach on the part of Recipient; (2) Recipient can demonstrate to have had rightfully in its possession prior to disclosure to Recipient by the Discloser; or (3) is independently developed by Recipient without the use of any of Discloser's Confidential Information. </p> <p> <b>2. Nondisclosure and Non-use of Confidential Information.</b> Recipient agrees to use the same degree of care (but in no event any less than reasonable care) that it uses to protect its own Confidential Information, to prevent the unauthorised use, disclosure, publication or dissemination of Discloser's Confidential Information. Recipient agrees to accept Discloser's Confidential Information for the sole purpose of evaluation of the Project or in furtherance of the Project. Recipient agrees not to use Confidential Information for its own or any third party's benefit without the prior written approval of an authorised representative of Discloser in each instance. Recipient may disclose Discloser's Confidential Information if required by any judicial or governmental request, requirement or order; provided that Recipient will take reasonable steps to give Discloser sufficient prior notice in order to contest such request, requirement or order by notifying Discloser of such request. Recipient will not disclose Discloser's Confidential Information to any person or entity outside Recipient's organisation without first obtaining written consent from the Discloser. Within Recipient's organisation, Recipient may disclose Discloser's Confidential Information only to employees having a need to know in connection with discussing the parties' proposed business relationship, who have previously been instructed as to the confidential nature of the information and who have agreed to keep such information confidential. Confidential Information may be disclosed by either party to other outside advisors, provided that such advisers sign a copy of this Agreement and agree to abide by its terms. </p> <p> <b>3. Reservation of Rights and Acknowledgment.</b> Each party reserves all rights in its Confidential Information. The disclosure of Confidential Information by one party does not give the other party or any other person any licence or other right in respect of any Confidential Information beyond the rights expressly set out in this Agreement. Except as expressly stated in this Agreement, neither party makes any express or implied warranty or representation concerning its Confidential Information, including but not limited to the accuracy, performance or completeness of the Confidential Information, which is provided on an 'as-is' basis. The disclosure of Confidential Information by the parties shall not form any offer by, or representation or warranty on the part of, that party to enter into any further agreement with the other party in relation to the Purpose. </p> <p> <b>4. Remedies.</b> Without prejudice to any other rights or remedies that each party may have, each party acknowledges and agrees that damages alone would not be an adequate remedy for any breach of the terms of this Agreement by the other party. Accordingly, each party shall be entitled to the remedies of injunctions, specific performance or other equitable relief for any threatened or actual breach of this Agreement. </p> <p> <b>5. Term.</b> Recipient's duty to protect Discloser's Confidential Information expires " + term + " years from the date of disclosure of Confidential Information. However, all obligations under this Agreement with respect to Confidential Information disclosed during the term of this Agreement shall survive such termination. Upon termination of this Agreement, both parties shall promptly comply with the requirements set out in Section 6 below. </p> <p> <b>6. Return or Destruction of Confidential Information.</b> If so requested by the Discloser at any time by notice in writing to Recipient or upon termination of this Agreement, Recipient shall: (a) destroy or return to the Discloser all documents and materials (and any copies) containing, reflecting, incorporating or based on the Discloser's Confidential Information; (b) erase all the Discloser's Confidential Information from its computer and communications systems and devices used by it, or which is stored in electronic form; and; (d) certify in writing to the Discloser that it has complied with the requirements of this Section 6. </p> <p> <b>7. No Obligation to Continue Discussions.</b> Nothing in this Agreement shall impose an obligation on either party to continue discussions or negotiations in connection with the Purpose, or an obligation on each party to disclose any information (whether Confidential Information or otherwise) to the other party. </p> <p> <b>8. Entire Agreement.</b> This Agreement constitutes the entire agreement with respect to the Confidential Information disclosed herein and supersedes all prior or contemporaneous oral or written agreements concerning such Confidential Information. This Agreement may not be amended except by the written agreement signed by authorised representatives of both parties. </p> <p> <b>9. Governing Law & Jurisdiction.</b> This Agreement and any dispute arising out of or in connection with this Agreement (including non-contractual disputes), will be governed by and construed in accordance with the laws of England & Wales. The parties irrevocably agree that the courts of England and Wales shall have exclusive jurisdiction to settle any dispute or claim that arises out of or in connection with this Agreement or its subject matter. </p> <p> <b>10. Survival</b> The terms and conditions of this Agreement will survive the expiration or other termination of this Agreement to the fullest extent necessary for their enforcement and for the realisation of the benefit thereof by the party in whose favour they operate. </p> <p> This Agreement has been entered into on the date stated at the beginning of it. </p> <p> Signature: </p> <div id='box' style='width: 1000px;'> <div id='left' style='max-width: 500px; float: left;'> <p> Full name: </p> <p> Date: </p> <br> <br> </div> <div id='right' style='max-width: 500px; float: right;'> <p> Signature: </p> <p> Full name: </p> <p> Date: </p> </div> </div></body></html>"
  makePDF("nda");
}

function makePDF(type) {
var source;
if (type == "nda") {
  source = nda;
}
var doc = new jsPDF();   
/*
var elementHandler = {
  '#ignorePDF': function (element, renderer) {
    return true;
  }
};
*/
doc.fromHTML(
    source,
    15,
    15,
    {
      'width': 180 //,'elementHandlers': elementHandler
    });

doc.output("dataurlnewwindow");
}

var C1 = '<div class="form-group"> <input type="text" class="form-control" id="cName1" placeholder="Company Name"> </div> <div class="form-group"> <input type="text" class="form-control" id="cCountry1" placeholder="Country where the company is registered"> </div> <div class="form-group"> <input type="text" class="form-control" id="cNumber1" placeholder="Company number/identifier"> </div> <div class="form-group"> <input type="text" class="form-control" id="cAddress1" placeholder="Company address"> </div> <div class="form-group"> <input type="text" class="form-control" id="cRep1" placeholder="Individual representing the company"> </div>'

var C2 = '<div class="form-group"> <input type="text" class="form-control" id="cName2" placeholder="Company Name"> </div> <div class="form-group"> <input type="text" class="form-control" id="cCountry2" placeholder="Country where the company is registered"> </div> <div class="form-group"> <input type="text" class="form-control" id="cNumber2" placeholder="Company number/identifier"> </div> <div class="form-group"> <input type="text" class="form-control" id="cAddress2" placeholder="Company address"> </div> <div class="form-group"> <input type="text" class="form-control" id="cRep1" placeholder="Individual representing the company"> </div>'
        
var I1 = '<div class="form-group"> <input type="text" class="form-control" id="iName1" placeholder="Individual\'s name"> </div> <div class="form-group"> <input type="text" class="form-control" id="iAddress1" placeholder="Individual\'s address"> </div>'

var I2 = '<div class="form-group"> <input type="text" class="form-control" id="iName2" placeholder="Individual\'s name"> </div> <div class="form-group"> <input type="text" class="form-control" id="iAddress2" placeholder="Individual\'s address"> </div>'


var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;
// <center><div style='margin-left: 50px !important;'>
// <form> <div class="form-group">  <input type="text" class="form-control" id="Name" aria-describedby="emailHelp" placeholder="Enter email"> <small id="emailHelp" class="form-text text-muted">We\'ll never share your email with anyone else.</small> </div> <div class="form-group"> <label for="exampleInputPassword1">Password</label> <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password"> </div>  
//setParties("28/06/2019", [true, "Company A", "Brazil", "123", "Rua do Cardeal 14"], [false, "João Carvalho", "Rua Washington 663"]);
