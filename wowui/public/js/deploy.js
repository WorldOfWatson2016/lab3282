var contractpath;
var enrollIdData;
var enrollSecretData;
var peer;
var registrationURL;
var deployURL;

var deployData = {
    jsonrpc: "2.0",
    method: "deploy",
    params: {
        type: 1,
        chaincodeID: {
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

function inputFocus(i) {
    if (i.value == i.defaultValue) {
        i.value = "";
        i.style.color = "#000";
    }
}

function inputBlur(i) {
    if (i.value == "") {
        i.value = i.defaultValue;
        i.style.color = "#888";
    }
}

function registerUser() {

    peer = document.getElementById("peerUrl").value;
    enrollIdData = document.getElementById("userName").value;
    enrollSecretData = document.getElementById("password").value;
    submitOK = true;

    $('#textarea-log').val("");

    if (peer === "https://peerurl:444") {
        alert("Peer name could not be empty");
        submitOK = false;
    }

    if (enrollIdData.length == 0) {
        alert("Enroll ID could not be empty");
        submitOK = false;
    }

    if (enrollSecretData.length == 0) {
        alert("Enroll Secret could not be empty");
        submitOK = false;
    }

    if (submitOK) {
        registrationURL = peer + "/registrar";
        registration.enrollId = enrollIdData;
        registration.enrollSecret = enrollSecretData;

        $.ajax({
            url: registrationURL,
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(registration),
            success: function(response) {
                $('#textarea-log').val(JSON.stringify(response));
				$('#peerUrl').val("");
				$('#userName').val("");
				$('#password').val("");	
            },
            error: function(xhr, status, error) {
                console.error(registration);
                console.error("Error while user registration");
            }
        });
    }

}

function deployContract() {

    peer = document.getElementById("peerUrl").value;
    enrollIdData = document.getElementById("userName").value;
    contractpath = document.getElementById("contract").value;
    submitOK = true;

    $('#textarea-log').val("");

    if (peer === "https://peerurl:444") {
        alert("Peer name could not be empty");
        submitOK = false;
    }

    if (enrollIdData.length == 0) {
        alert("Enroll ID could not be empty");
        submitOK = false;
    }

    if (submitOK) {
        deployURL = peer + "/chaincode";
        deployData.params.chaincodeID.path = contractpath;
        deployData.params.secureContext = enrollIdData;

        $.ajax({
            url: deployURL,
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(deployData),
            success: function(response) {
                $('#textarea-log').val(JSON.stringify(response));
				$('#peerUrl').val("");
				$('#userName').val("");
				$('#password').val("");	
            },
            error: function(xhr, status, error) {
                console.error("Error while deployment of chaincode.");
            }
        });
    }

}