var contractpath;
var enrollIdData;
var enrollSecretData;
var peer;
var registrationURL;
var deployURL;

var deploy = {
  jsonrpc: "2.0",
  method : "deploy",
  params: {
    type: 1,
    chaincodeID:{
        path: contractpath
    },
    ctorMsg: {
    function: "init",
    args: ["{\"version\":\"1.0\"}"]
    },
    secureContext: enrollIdData
  },
  id: 101010
}

var registration = {
  "enrollId": enrollIdData,
  "enrollSecret": enrollSecretData
}

function inputFocus(i){
    if(i.value==i.defaultValue){ i.value=""; i.style.color="#000"; }
}
function inputBlur(i){
    if(i.value==""){ i.value=i.defaultValue; i.style.color="#888"; }
}

function registerUser() {
	
	peer             = document.getElementById("peerUrl").value;
	enrollIdData     = document.getElementById("userName").value;
	enrollSecretData = document.getElementById("password").value;
	submitOK         = true;
	
	if (peer === "https://peerurl:444") {
		alert("Peer name could not be empty");
        submitOK = "false";
	}
	
	if (enrollIdData.length == 0) {
	    alert("Enroll ID could not be empty");
        submitOK = "false";
	}
	
	if (enrollSecretData.length == 0) {
	    alert("Enroll Secret could not be empty");
        submitOK = "false";
	}
	
	if(submitOK) {
		registrationURL = peer + "/registrar"
		registration.enrollId=enrollIdData;
		registration.enrollSecret=enrollSecretData;
		register();
	}
	
}

function register() {
	
	    $.ajax({
		url: registrationURL,
		type: "POST",
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify(registration),
		success: function(response) {
			console.log(registration);
		},
		error: function(xhr, status, error) {
			console.error(registration);
			console.error("Could not fetch organization information.");
		}});
}

function deployContract() {
	
	peer         = document.getElementById("peerUrl").value;
	enrollIdData = document.getElementById("userName").value;
	contractpath = document.getElementById("contract").value;
	submitOK = true;
	
	if (peer === "https://peerurl:444") {
		alert("Peer name could not be empty");
        submitOK = "false";
	}
	
	if (enrollIdData.length == 0) {
	    alert("Enroll ID could not be empty");
        submitOK = "false";
	}
	
	if(submitOK) {
		deployURL = peer + "/chaincode";
		deploy.params.chaincodeID.path=enrollIdData;
		deploy.params.secureContext=contractpath;
		deployContract();
	}
	
}


function deployContract() {
	
	    $.ajax({
		url: deployURL,
		type: "POST",
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify(deploy),
		success: function(response) {
			console.log(deploy);
		},
		error: function(xhr, status, error) {
			console.error(deploy);
			console.error("Error while deployment of chaincode.");
		}});
}