var orgId;
var userName;

var enableBC = {
    "enable": true
}

var disableBC = {
    "enable": false
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

function activateBlockchain() {

    orgId = document.getElementById("orgID").value;
    submitOK = true;

    if (orgId === "b304dv") {
        alert("Organization Name could not be empty");
        submitOK = false;
    }

    if (submitOK) {

        activationURL = "https://" + orgId + ".internetofthings.ibmcloud.com/api/v0002/blockchain/activate?code=" + orgId;

        $.ajax({
            url: activationURL,
            type: "GET",
            success: function(response) {
                alert("Activation Successful");
            },
            error: function(xhr, status, error) {
                alert("Blockchain Activation Failure");
                console.error("Could not activate Blockchain.");
            }
        });

    }
}

function enableBlockchain() {
    orgId = document.getElementById("orgID").value;
    submitOK = true;

    if (orgId === "b304dv") {
        alert("Organization Name could not be empty");
        submitOK = false;
    }

    if (submitOK) {
        enableURL = "https://" + orgId + ".internetofthings.ibmcloud.com/api/v0002/blockchain/enable";
        $.ajax({
            url: enableURL,
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(enableBC),
            success: function(response) {
                alert("Activation Successful");
            },
            error: function(xhr, status, error) {
                alert("Blockchain Enabling Failure");
                console.error("Could not enable Blockchain.");
            }
        });
    }
}


function activateURL() {
	var activationURL;
	orgId = document.getElementById("orgID").value;
	submitOK = true;
	
    if (orgId === "b304dv") {
        alert("Organization Name could not be empty");
        submitOK = false;
    }

    if (submitOK) {
    	
    	activationURL = "https://" + orgId + ".internetofthings.ibmcloud.com/api/v0002/blockchain/activate?code=" + orgId;
    }
    
    return activationURL;
}

function RedirectURL()
{
    window.location= activateURL();
}