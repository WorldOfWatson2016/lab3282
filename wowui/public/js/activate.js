var orgId;
var userName;

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

function activateRedirectURL()
{
    window.location = activateURL();
}

function configURL() {
	var configURL;
	
	orgId = document.getElementById("orgID").value;
	username = document.getElementById("uname").value;
	
	submitOK = true;
	
    if (orgId === "b304dv") {
        alert("Organization Name could not be empty");
        submitOK = false;
    }
    
    if (orgId === "") {
        alert("User Name could not be empty");
        submitOK = false;
    }

    if (submitOK) {
    	
    	activationURL = "https://" + orgId + ".internetofthings.ibmcloud.com/dashboard/#/config-v2";
    }
    
    return activationURL;
}

function configRedirectURL()
{
    window.location = configURL();
}