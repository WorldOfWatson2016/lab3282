var orgId;
var userName;
var userEmail;

var registration = {
    "username": userName,
    "orgid": orgId,
	"email": userEmail
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

function activateURL() {
    var activationURL = "/activate";
    orgId = document.getElementById("orgID").value;
    submitOK = true;

    if (orgId === "b304dv") {
        alert("Organization Name could not be empty");
        submitOK = false;
    }

    if (submitOK) {

        activationURL = "https://" + orgId + ".internetofthings.ibmcloud.com/api/v0002/blockchain/activate?code=wow2016lab3282";
    }

    return activationURL;
}

function activateRedirectURL() {
    window.location = activateURL();
}

function configURL() {
    var enableURL = "/activate";

    orgId = document.getElementById("orgID").value;
    userName = document.getElementById("uname").value;
	userEmail = document.getElementById("email").value;

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

        registration.username  = userName;
        registration.orgid     = orgId;
		registration.email     = userEmail;

        $.ajax({
            url: "/activate/iot",
            type: "POST",
			dataType: "json",
			contentType: "application/json; charset=utf-8",
            data: JSON.stringify(registration),
            success: function(response) {
                console.log("Success in user registration")
				enableURL = "https://" + orgId + ".internetofthings.ibmcloud.com/dashboard/#/config-v2";
            },
            error: function(xhr, status, error) {
                console.error("Error while user registration");
            },
            async: false
        });
    }
    return enableURL;
}

function configRedirectURL() {
    window.location = configURL();
}