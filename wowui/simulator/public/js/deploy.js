function inputFocus(i){
    if(i.value==i.defaultValue){ i.value=""; i.style.color="#000"; }
}
function inputBlur(i){
    if(i.value==""){ i.value=i.defaultValue; i.style.color="#888"; }
}

function registerUser() {
	
	var peer     = document.getElementById("peerUrl").value;
	var username = document.getElementById("userName").value;
	var password = document.getElementById("password").value;
	submitOK = true;
	
	if (peer === "https://peerurl:444") {
		alert("Peer name could not be empty");
        submitOK = "false";
	}
	
	if (username.length == 0) {
	    alert("User name could not be empty");
        submitOK = "false";
	}
	
	if (password.length == 0) {
	    alert("Password could not be empty");
        submitOK = "false";
	}
	
	if(submitOK) {
		alert("Registering User");
	}
	
}


function deployContract() {
	
	var peer     = document.getElementById("peerUrl").value;
	var username = document.getElementById("userName").value;
	var password = document.getElementById("password").value;
	submitOK = true;
	
	if (peer === "https://peerurl:444") {
		alert("Peer name could not be empty");
        submitOK = "false";
	}
	
	if (username.length == 0) {
	    alert("User name could not be empty");
        submitOK = "false";
	}
	
	if (password.length == 0) {
	    alert("Password could not be empty");
        submitOK = "false";
	}
	
	if(submitOK) {
		alert("Deploy Contract");
	}
	
}