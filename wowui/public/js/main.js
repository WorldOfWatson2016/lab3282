var device

var client;
var iot_org;
var iot_apiKey;
var iot_apiToken;
var iot_typeId;
var iot_deviceId;
var iot_host;
var iot_port;
var iot_clientid;
var iot_username;
var iot_password;

var isConnected = false;

var model = {
	data: {
		assetID:null,
		weight: 100,
		speed: 2,
		power: 80,
		temperature: 25,
		system: {
			cpu: 0.25,
			memory: 485908145
		}
	},
	credentials:{
		orgId : null,
		apiKey : null,
		apiToken : null,
		typeId : null,
		deviceId : null
	}
}

function init() {
	$('#weight').slider({ formatter: function(value) { model.data.weight = value; return value; } });
	$('#speed').slider({ formatter: function(value) { model.data.speed = value; return value; } });
	$('#power').slider({ formatter: function(value) { model.data.power = value; return value; } });
	$('#temp').slider({ formatter: function(value) { model.data.temperature = value; return value; } });
	$('#cpu').slider({ formatter: function(value) { model.data.system.cpu = value; return value; } });
	$('#memory').slider({ formatter: function(value) { model.data.system.memory = value; return value; } });

	$(".iot-config-button").click(function(evt) {
		model.credentials.orgId = $('#orgId').val();
		model.credentials.apiKey = $('#apiKey').val();
		model.credentials.apiToken = $('#apiToken').val();

		onConfirmConfig();
	});
}

var bRandomize = true;

function getTopicName(eventId){
	return "iot-2/type/"
		+ model.credentials.typeId
		+ "/id/"
		+ model.credentials.deviceId
		+ "/evt/"
		+ eventId
		+"/fmt/json";
}

function publishWeight() {
	//var res = publishMessage(getTopicName("weight"), model.weight);
	var res = publishMessage(getTopicName("data"), model.data);
	$("#indicator-weight").addClass("pub");
	setTimeout(function() { $("#indicator-weight").removeClass("pub"); }, 150);
	if (res) {
		if (bRandomize) {
			model.data.weight += -10 + Math.random() * 20;
			//model.data.weight = Math.floor(Math.random() * (500 - 0) + 0);
			$('#weight').slider('setValue', model.data.weight);
		}
		setTimeout(publishWeight, 2000);
	}
}

function publishSpeed() {
	//var res = publishMessage(getTopicName("speed"), model.speed);
	//var res = publishMessage(getTopicName("data"), model.data);
	var res = true;
	$("#indicator-speed").addClass("pub");
	setTimeout(function() { $("#indicator-speed").removeClass("pub"); }, 150);
	if (res) {
		if (bRandomize) {
			model.data.speed += -2 + Math.random() * 4;
			//model.data.speed = Math.floor(Math.random() * (10 - 0) + 0);
			$('#speed').slider('setValue', model.data.speed);
		}
		setTimeout(publishSpeed, 500);
	}
}

function publishPower() {
	//var res = publishMessage(getTopicName("power"), model.power);
	//var res = publishMessage(getTopicName("data"), model.data);
	var res = true;
	$("#indicator-power").addClass("pub");
	setTimeout(function() { $("#indicator-power").removeClass("pub"); }, 150);
	if (res) {
		if (bRandomize) {
			model.data.power += -2 + Math.random() * 4;
			//model.data.power = Math.floor(Math.random() * (200 - 50) + 50);
			$('#power').slider('setValue', model.data.power);
		}
		setTimeout(publishPower, 500);
	}
}

function publishTemp() {
	//var res = publishMessage(getTopicName("temp"), model.temp);
	//var res = publishMessage(getTopicName("data"), model.data);
	var res = true;
	$("#indicator-temp").addClass("pub");
	setTimeout(function() { $("#indicator-temp").removeClass("pub"); }, 150);
	if (res) {
		if (bRandomize) {
			model.data.temperature += -1 + Math.random() * 4;
			//model.data.temperature += Math.floor(Math.random() * (80 - 20) + 20);
			$('#temp').slider('setValue', model.data.temperature);
		}
		setTimeout(publishTemp, 2000);
	}
}

function publishSys() {
	//var res = publishMessage(getTopicName("sys"), model.sys);
	//var res = publishMessage(getTopicName("data"), model.data);
	var res = true;
	$("#indicator-sys").addClass("pub");
	setTimeout(function() { $("#indicator-sys").removeClass("pub"); }, 150);
	if (res) {
		if (bRandomize) {
			model.data.system.cpu += -0.05 + Math.random() * 0.1;
			model.data.system.memory += -100000 + Math.random() * 200000;
			$('#cpu').slider('setValue', model.data.system.cpu);
			$('#memory').slider('setValue', model.data.system.memory);
		}
		setTimeout(publishSys, 10000);
	}
}

function publishMessage(topic, payload) {
	try {
		var message = new Paho.MQTT.Message(JSON.stringify({ d: payload }));
		message.destinationName = topic;
		console.log(topic, payload);
		window.client.send(message);
		return true;
	} catch (e) {
		onConnectFailure();
	}
}

function startPublish() {
	if (isConnected) {
		publishWeight();
		publishTemp();
		publishSpeed();
		publishPower();
		publishSys();
	}
}


function onConfirmConfig(){
	$.ajax({
		url: "/config",
		type: "PUT",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		data: JSON.stringify({
			orgId : model.credentials.orgId,
			apiKey : model.credentials.apiKey,
			apiToken : model.credentials.apiToken
		}),
		success: function(response) {
			console.log(response);

			$.ajax({
				url: "/credentials",
				type: "GET",
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				success: function(response) {
					console.log(response);
					window.iot_org = response.org;
					window.iot_apiKey = response.apiKey;
					window.iot_apiToken = response.apiToken;
					window.iot_typeId = response.typeId;
					window.iot_deviceId = response.deviceId;
					window.iot_host = response.org + ".messaging.internetofthings.ibmcloud.com";
					window.iot_port = 1883;
					//window.iot_clientid = "d:"+response.org+":"+response.typeId+":"+response.deviceId;
					window.iot_clientid = "a:"+response.org+":"+"123243432423423";
					//window.iot_username = "use-token-auth";
					window.iot_username = response.apiKey;
					window.iot_password = response.apiToken;
					$("#deviceId").html(response.deviceId);
					window.client = new Paho.MQTT.Client(window.iot_host, window.iot_port, window.iot_clientid);

					model.credentials.typeId = response.typeId;
					model.credentials.deviceId = response.deviceId;
					model.data.assetID = response.deviceId;

					connectDevice();
					//registerDevice();
				},
				error: function(xhr, status, error) {
					console.error("Could not fetch organization information.");
				}
			});

		},
		error: function(xhr, status, error) {
			console.error(xhr, status, error);
		}
	});



}

function onConnectSuccess() {
	// The device connected successfully
	console.log("Connected Successfully!");
	isConnected = true;
	$(".connectionStatus").html("Connected");
	$(".connectionStatus").addClass("connected");

	/*	if (navigator.geolocation) {
	 navigator.geolocation.getCurrentPosition(function(position) {
	 console.log(position);
	 startPublish();
	 });
	 } else {
	 startPublish();
	 }
	 */

	startPublish();
}

function onConnectFailure() {
	// The device failed to connect. Let's try again in one second.
	console.log("Unable to connect to IoT Foundation! Trying again in one second.");
	isConnected = false;
	$(".connectionStatus").html("Connecting");
	$(".connectionStatus").removeClass("connected");
	setTimeout(connectDevice(), 1000);
}

function connectDevice() {
	//$("#deviceId").html(window.deviceId);

	$(".connectionStatus").html("Connecting");
	$(".connectionStatus").removeClass("connected");
	console.log("Connecting device to IoT Foundation...");
	window.client.connect({
		onSuccess: onConnectSuccess,
		onFailure: onConnectFailure,
		userName: window.iot_username,
		password: window.iot_password,
		useSSL:true
	});
}

$(document).ready(function() {
	init();
});

function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}