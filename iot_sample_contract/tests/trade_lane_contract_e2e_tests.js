/*******************************************************************************
Copyright (c) 2016 IBM Corporation.


Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.


Contributors:

Keerthi Challabotla - Initial Contribution

******************************************************************************/
//SN: March 2016

// Test for IoT Blockchain Tradelane Contract version - 3.0.5


var q			= require('q');
var chai 		= require('chai');
var should 		= chai.should();
var assert		= require("assert");
var request = require('request');
//var testDeploy = require('./deploy').testDeploy();

var logger		= require('./logger').createLogger();
var internal  	= require('./index');
var Config = require('./config');

describe(" Testing the IoT Sample Contract against specified fabric, or iun debug mode ",
function () {
	this.timeout(50000);

	var config = {
		host: Config.host, 
		port: Config.port, 
		secure_context: Config.secure_context, 
		enroll_secret: Config.enroll_secret,
		protocol: Config.protocol,
		debug_mode: Config.debug_mode,
		chaincodeURL: Config.protocol + "://" + Config.host + ":" + Config.port + "/chaincode",
		name: Config.name,
		path: Config.path,
		messageId: "",
		contract_version: "4.1",
		timeout: 3000,
		template: {
						"jsonrpc": "2.0",
						"method": "{{method}}",
						"params": {
							"type": 1,
							"chaincodeID":{
								"name":"mycc",
							},
							"ctorMsg": {
								"function":"{{function}}",
								"args":[],
							},
							"secureContext": Config.secure_context,
						},
						"id": 1234
					},
	}
	
    
//-------------------------------------------------------------------------------------------//

/*
		config,
		"init",
		JSON.stringify({
			"version": "4.1",
			"nickname": "IoT_Test_Contract"
		})
	);
*/
	it(" Should deploy contract version : " + config.contract_version, function (complete) {	
		var deployBody = config.template;
		deployBody.method = 'deploy';
		if (config.debug_mode) {
			deployBody.params.chaincodeID.name = 'mycc';
		} else {
			deployBody.params.chaincodeID.path = '{{tbd}}';
		}
		deployBody.params.ctorMsg.function = 'init';
		deployBody.params.ctorMsg.args[0] = JSON.stringify({
			"version": "4.1",
			"nickname": "IoT_Test_Contract"
		});
		
		var options = { 
			url : config.chaincodeURL,
			headers : {'Content-Type':'application/json'},
			body : JSON.stringify(deployBody)
			};
		
		logger.info("Deploy demo contract...");
		var req = request.defaults(options);
		//logger.info("Sending: " + JSON.stringify(deployBody));
		return internal.doRequest(null, "POST", req)
		.then(function (result) {
			if (result.error) {
				throw new Error("Failed to deploy demo contract: " + result.error);
			}
			result.response.statusCode.should.be.equal(200);
			var res = JSON.parse(result.body).result;
			//logger.info("Result: " + JSON.stringify(res));
			res.should.have.property("status");
			res["status"].should.equal("OK");
			res.should.have.property("message");	
			contractId = res.message;
			complete();
		})
		.catch(function (error) {
			//assert.fail(null, null, error);
			complete(error);
		})
		.done()
	});
    
//-------------------------------------------------------------------------------------------//
	
/*	
	it(" Should delete all asset and read all assets", function(complete) {		
		var invokeBody = template;
		invokeBody.method = 'invoke';
		if (debug_mode) {
			invokeBody.params.chaincodeID.name = 'mycc';
		} else {
			invokeBody.params.chaincodeID.path = '{{tbd}}';
		}
		invokeBody.params.ctorMsg.function = 'deleteAllAssets';
		invokeBody.params.ctorMsg.args[0] = JSON.stringify({});
		
		var options = { 
				url : chaincodeURL,
				headers : {'Content-Type':'application/json'},
				body : JSON.stringify(invokeBody) 
			};
		
		logger.info("Delete all assets...");
		var req = request.defaults(options);
		return internal.doRequest(null, "POST", req)
		.then(function (result) {
			if (result.error) {
				throw new Error("Failed to invoke the contract: " + result.error);
			}
						
			result.response.statusCode.should.be.equal(200);
			var res = JSON.parse(result.body).result;
			//logger.info("Result: " + JSON.stringify(res));
			res.should.have.property("status");
			res["status"].should.equal("OK");
			res.should.have.property("message");	
			messageId = res.message;

			return q.delay(timeout)	
		})
	
		.then(function () {
			
			var queryBody = template;
			queryBody.method = 'query';
			if (debug_mode) {
				queryBody.params.chaincodeID.name = 'mycc';
			} else {
				queryBody.params.chaincodeID.path = '{{tbd}}';
			}
			queryBody.params.ctorMsg.function = 'readAllAssets';
			queryBody.params.ctorMsg.args = [];
			
			
			var options = { 
					url : chaincodeURL,
					headers : {'Content-Type':'application/json'},
					body : JSON.stringify(queryBody) 
				};
			
			logger.info("Read all assets...");
			var req = request.defaults(options);
			return internal.doRequest(null, "POST", req) 
		})

		.then(function (result) {	
			if (result.error) {
				throw new Error("Failed to invoke the contract: " + result.error);
			}
			result.response.statusCode.should.be.equal(200);
			
			var res = JSON.parse(result.body).result;
			res.should.have.property("status");
			res["status"].should.equal("OK");
			res["message"].should.equal("[]");
			complete();
		})
		.catch(function (error) {
			//assert.fail(null, null, error);
			complete(error);
		})
		.done()
	});
		
	
//-------------------------------------------------------------------------------------------//
	
	it(" Should create asset and read all assets ", function(complete) {

		var createBody = {
				chaincodeSpec : {
			    type : "GOLANG",
			    chaincodeID : {
			      name : contractId
			    },
			    ctorMsg : {
			      function : "createAsset",
			      args : [ "{\"assetID\":\"ASSET1\",\"temperature\":0.1}"]
			    		},
                    "secureContext":secure_context
					}
				};
		
		var options = { 
				url : chaincodeURL,
				headers : {'Content-Type':'application/json'},
				body : JSON.stringify(createBody) //converts a value to JSON notation
				};
		
		logger.info("Creating Asset...");
		var req = request.defaults(options);
		return internal.doRequest(null, "POST", req)
		.then(function (result) {
		if (result.error) {
			throw new Error("Failed to invoke the contract: " + result.error);
		}
					
		result.response.statusCode.should.be.equal(200);
		
		var body = JSON.parse(result.body);
		body.should.have.property("OK");
		body["OK"].should.equal("Successfully invoked chainCode.");
		body.should.have.property("message");
		messageId = body.message;
		
		return q.delay(timeout)	
		})
		
		.then(function () {
	
		var readBody = {
				chaincodeSpec : {
			    type: "GOLANG",
			    chaincodeID: {
			      name: contractId
			    },
			    ctorMsg: {
			      function: "readAllAssets",
			      args: [  ]
			    },
                    "secureContext":secure_context
				}
			};
			
		var options = { 
				url : chaincodeURL,
				headers : {'Content-Type':'application/json'},
				body : JSON.stringify(readBody) 
			};
		
		logger.info("Read all assets...");
		var req = request.defaults(options);
		return internal.doRequest(null, "POST", req) 
		})
			.then(function (result) {
			if (result.error) {
				throw new Error("Failed to invoke the contract: " + result.error);
			}
						
			result.response.statusCode.should.be.equal(200);
			var body = JSON.parse(result.body);
			body.should.have.property("OK");			
			
			var assetBody = JSON.parse(body['OK']);
			assetBody.should.be.instanceof(Array).and.have.lengthOf(1);
			
			var arrayBody  = assetBody[0];
			arrayBody.should.have.property("alerts");
			arrayBody['alerts'].should.have.property("active");
			arrayBody['alerts'].should.have.property("cleared");
			arrayBody['alerts'].should.have.property("raised");
			arrayBody.should.have.property("assetID");
			arrayBody.should.have.property("incompliance");
			arrayBody.should.have.property("lastEvent");
                arrayBody['lastEvent'].should.have.property("args");
                var eventBody = JSON.parse(arrayBody['lastEvent']['args']);
                eventBody.should.have.property("assetID");
                eventBody['assetID'].should.equal("ASSET1");
                eventBody.should.have.property("temperature");
                eventBody['temperature'].should.equal(0.1);
			complete();
		})
		.catch(function (error) {
			//assert.fail(null, null, error);
			complete(error);
		})
		.done()
	});
	
//-------------------------------------------------------------------------------------------//
		
		it(" Should create asset and read all assets ", function(complete) {

			var createBody = {
					chaincodeSpec : {
				    type : "GOLANG",
				    chaincodeID : {
				      name : contractId
				    },
				    ctorMsg : {
				      function : "createAsset",
				      args : [ "{\"assetID\":\"ASSET7\",\"temperature\":0}"]
				    		},
                        "secureContext":secure_context
						}
					};
			
			var options = { 
					url : chaincodeURL,
					headers : {'Content-Type':'application/json'},
					body : JSON.stringify(createBody) //converts a value to JSON notation
					};
			
			logger.info("Creating Asset...");
			var req = request.defaults(options);
			return internal.doRequest(null, "POST", req)
			.then(function (result) {
			if (result.error) {
				throw new Error("Failed to invoke the contract: " + result.error);
			}
						
			result.response.statusCode.should.be.equal(200);
			
			var body = JSON.parse(result.body);
			body.should.have.property("OK");
			body["OK"].should.equal("Successfully invoked chainCode.");
			body.should.have.property("message");
			messageId = body.message;
			
			return q.delay(timeout)	
			})
			
			.then(function () {
		
			var readBody = {
					chaincodeSpec : {
				    type: "GOLANG",
				    chaincodeID: {
				      name: contractId
				    },
				    ctorMsg: {
				      function: "readAllAssets",
				      args: [ ]
				    },
                        "secureContext":secure_context
					}
				};
				
			var options = { 
					url : chaincodeURL,
					headers : {'Content-Type':'application/json'},
					body : JSON.stringify(readBody) 
				};
			
			logger.info("Read all assets...");
			var req = request.defaults(options);
			return internal.doRequest(null, "POST", req) 
			})
				.then(function (result) {
				if (result.error) {
					throw new Error("Failed to invoke the contract: " + result.error);
				}
							
                result.response.statusCode.should.be.equal(200);
			var body = JSON.parse(result.body);
			body.should.have.property("OK");			
			
			var assetBody = JSON.parse(body['OK']);
			assetBody.should.be.instanceof(Array).and.have.lengthOf(2);
			
			var arrayBody  = assetBody[0];
			arrayBody.should.have.property("alerts");
			arrayBody['alerts'].should.have.property("active");
			arrayBody['alerts'].should.have.property("cleared");
			arrayBody['alerts'].should.have.property("raised");
			arrayBody.should.have.property("assetID");
			arrayBody.should.have.property("incompliance");
			arrayBody.should.have.property("lastEvent");
                arrayBody['lastEvent'].should.have.property("args");
                var eventBody = JSON.parse(arrayBody['lastEvent']['args']);
                eventBody.should.have.property("assetID");
                eventBody['assetID'].should.equal("ASSET1");
                eventBody.should.have.property("temperature");
                eventBody['temperature'].should.equal(0.1);
                
            var arrayBody  = assetBody[1];
			arrayBody.should.have.property("assetID");
			arrayBody.should.have.property("incompliance");
			arrayBody.should.have.property("lastEvent");
                arrayBody['lastEvent'].should.have.property("args");
                var eventBody = JSON.parse(arrayBody['lastEvent']['args']);
                eventBody.should.have.property("assetID");
                eventBody['assetID'].should.equal("ASSET7");
                eventBody.should.have.property("temperature");
                eventBody['temperature'].should.equal(0);

				
				complete();
			})
			.catch(function (error) {
				//assert.fail(null, null, error);
				complete(error);
			})
			.done()
		});
    
//-------------------------------------------------------------------------------------------//
		
		it(" Should create asset and read all assets ", function(complete) {

			var createBody = {
					chaincodeSpec : {
				    type : "GOLANG",
				    chaincodeID : {
				      name : contractId
				    },
				    ctorMsg : {
				      function : "createAsset",
				      args : [ "{\"assetID\":\"ASSET8\",\"temperature\":-4}"]
				    		},
                        "secureContext":secure_context
						}
					};
			
			var options = { 
					url : chaincodeURL,
					headers : {'Content-Type':'application/json'},
					body : JSON.stringify(createBody) //converts a value to JSON notation
					};
			
			logger.info("Creating Asset...");
			var req = request.defaults(options);
			return internal.doRequest(null, "POST", req)
			.then(function (result) {
			if (result.error) {
				throw new Error("Failed to invoke the contract: " + result.error);
			}
						
			result.response.statusCode.should.be.equal(200);
			
			var body = JSON.parse(result.body);
			body.should.have.property("OK");
			body["OK"].should.equal("Successfully invoked chainCode.");
			body.should.have.property("message");
			messageId = body.message;
			
			return q.delay(timeout)	
			})
			
			.then(function () {
		
			var readBody = {
					chaincodeSpec : {
				    type: "GOLANG",
				    chaincodeID: {
				      name: contractId
				    },
				    ctorMsg: {
				      function: "readAllAssets",
				      args: [  ]
				    },
                        "secureContext":secure_context
					}
				};
				
			var options = { 
					url : chaincodeURL,
					headers : {'Content-Type':'application/json'},
					body : JSON.stringify(readBody) 
				};
			
			logger.info("Read all assets...");
			var req = request.defaults(options);
			return internal.doRequest(null, "POST", req) 
			})
				.then(function (result) {
				if (result.error) {
					throw new Error("Failed to invoke the contract: " + result.error);
				}
							
				 result.response.statusCode.should.be.equal(200);
			var body = JSON.parse(result.body);
			body.should.have.property("OK");			
			
			var assetBody = JSON.parse(body['OK']);
			assetBody.should.be.instanceof(Array).and.have.lengthOf(3);
			
			var arrayBody  = assetBody[0];
			arrayBody.should.have.property("alerts");
			arrayBody['alerts'].should.have.property("active");
			arrayBody['alerts'].should.have.property("cleared");
			arrayBody['alerts'].should.have.property("raised");
			arrayBody.should.have.property("assetID");
			arrayBody.should.have.property("incompliance");
			arrayBody.should.have.property("lastEvent");
                arrayBody['lastEvent'].should.have.property("args");
                var eventBody = JSON.parse(arrayBody['lastEvent']['args']);
                eventBody.should.have.property("assetID");
                eventBody['assetID'].should.equal("ASSET1");
                eventBody.should.have.property("temperature");
                eventBody['temperature'].should.equal(0.1);
                
            var arrayBody  = assetBody[1];
			arrayBody.should.have.property("assetID");
			arrayBody.should.have.property("incompliance");
			arrayBody.should.have.property("lastEvent");
                arrayBody['lastEvent'].should.have.property("args");
                var eventBody = JSON.parse(arrayBody['lastEvent']['args']);
                eventBody.should.have.property("assetID");
                eventBody['assetID'].should.equal("ASSET7");
                eventBody.should.have.property("temperature");
                eventBody['temperature'].should.equal(0);

             var arrayBody  = assetBody[2];
			arrayBody.should.have.property("assetID");
			arrayBody.should.have.property("incompliance");
			arrayBody.should.have.property("lastEvent");
                arrayBody['lastEvent'].should.have.property("args");
                var eventBody = JSON.parse(arrayBody['lastEvent']['args']);
                eventBody.should.have.property("assetID");
                eventBody['assetID'].should.equal("ASSET8");
                eventBody.should.have.property("temperature");
                eventBody['temperature'].should.equal(-4);
				
				complete();
			})
			.catch(function (error) {
				//assert.fail(null, null, error);
				complete(error);
			})
			.done()
		});


//-------------------------------------------------------------------------------------------//
    
    it(" Should read particular asset ", function(complete) {
		
		var readBody = {
					chaincodeSpec : {
				    type: "GOLANG",
				    chaincodeID: {
				      name: contractId
				    },
				    ctorMsg: {
				      function: "readAsset",
				      args: [ "{\"assetID\":\"ASSET7\"}" ]
				    },
                        "secureContext":secure_context
					}
				};
			
			var options = { 
					url : chaincodeURL,
					headers : {'Content-Type':'application/json'},
					body : JSON.stringify(readBody)
					};
			
			logger.info("Reading asset...")
			var req = request.defaults(options);
			return internal.doRequest(null, "POST", req) 
			.then(function (result) {	
				if (result.error) {
					throw new Error("Failed to invoke the contract: " + result.error);
				}
				result.response.statusCode.should.be.equal(200);
			var body = JSON.parse(result.body);
			body.should.have.property("OK");			
			
			body['OK'].should.have.property("assetID");
            body['OK']['assetID'].should.equal("ASSET7");
			body['OK'].should.have.property("incompliance");
            should.equal(body['OK']['incompliance'],true);
			body['OK'].should.have.property("lastEvent");
			var eventBody = body['OK']['lastEvent'];
			eventBody.should.have.property("args");
            eventBody.should.have.property("function");
			var assetBody = JSON.parse(eventBody['args']);
			assetBody.should.have.property("assetID");
			assetBody['assetID'].should.equal("ASSET7");
            assetBody.should.have.property("temperature");
			assetBody['temperature'].should.equal(0);
			eventBody['function'].should.equal("createAsset");
				
				complete();
			})
		.catch(function (error) {
			//assert.fail(null, null, error);
			complete(error);
		})
		.done()
	});
    
//-------------------------------------------------------------------------------------------//
	
it(" Should read contract state ", function(complete) {
		
		var readBody = {
					chaincodeSpec : {
				    type: "GOLANG",
				    chaincodeID: {
				      name: contractId
				    },
				    ctorMsg: {
				      function: "readContractState",
				      args: [  ]
				    },
                    "secureContext":secure_context
					}
				};
			
			var options = { 
					url : chaincodeURL,
					headers : {'Content-Type':'application/json'},
					body : JSON.stringify(readBody)
					};
			
			logger.info("Reading Contract State...")
			var req = request.defaults(options);
			return internal.doRequest(null, "POST", req) 
			.then(function (result) {	
				if (result.error) {
					throw new Error("Failed to invoke the contract: " + result.error);
				}
				result.response.statusCode.should.be.equal(200);
				var body = JSON.parse(result.body);
				body.should.have.property("OK");
				
				var conBody = body['OK'];
				conBody.should.have.property("version");
				conBody['version'].should.equal(contract_version);
				
				conBody.should.have.property("nickname");
				conBody['nickname'].should.equal("TRADELANE");
				
				conBody.should.have.property("activeAssets");
				conBody['activeAssets'].should.have.property("ASSET1");
				should.equal(conBody['activeAssets']['ASSET1'],true);
				conBody['activeAssets'].should.have.property("ASSET7");
				should.equal(conBody['activeAssets']['ASSET7'],true);
				conBody['activeAssets'].should.have.property("ASSET8");
				should.equal(conBody['activeAssets']['ASSET8'],true);
				
				complete();
			})
		.catch(function (error) {
			//assert.fail(null, null, error);
			complete(error);
		})
		.done()
	});

//-------------------------------------------------------------------------------------------//


it(" Should read Asset Schemas ", function(complete) {
	
	var readBody = {
				chaincodeSpec : {
			    type: "GOLANG",
			    chaincodeID: {
			      name: contractId
			    },
			    ctorMsg: {
			      function: "readAssetSchemas",
			      args: [  ]
			    },
                    "secureContext":secure_context
				}
			};
		
		var options = { 
				url : chaincodeURL,
				headers : {'Content-Type':'application/json'},
				body : JSON.stringify(readBody)
				};
		
		logger.info("Reading Asset Schemas...")
		var req = request.defaults(options);
		return internal.doRequest(null, "POST", req) 
		.then(function (result) {	
			if (result.error) {
				throw new Error("Failed to invoke the contract: " + result.error);
			}
			result.response.statusCode.should.be.equal(200);
			var body = JSON.parse(result.body);
			body.should.have.property("OK");
			body['OK'].should.have.property("API");
			body['OK'].should.have.property("objectModelSchemas");
		
			complete();
		})
	.catch(function (error) {
		//assert.fail(null, null, error);
		complete(error);
	})
	.done()
});


//-------------------------------------------------------------------------------------------//


it(" Should read Asset Samples ", function(complete) {
	
	var readBody = {
				chaincodeSpec : {
			    type: "GOLANG",
			    chaincodeID: {
			      name: contractId
			    },
			    ctorMsg: {
			      function: "readAssetSamples",
			      args: [  ]
			    },
                    "secureContext":secure_context
				}
			};
		
		var options = { 
				url : chaincodeURL,
				headers : {'Content-Type':'application/json'},
				body : JSON.stringify(readBody)
				};
		
		logger.info("Reading Asset Samples...")
		var req = request.defaults(options);
		return internal.doRequest(null, "POST", req) 
		.then(function (result) {	
			if (result.error) {
				throw new Error("Failed to invoke the contract: " + result.error);
			}
			result.response.statusCode.should.be.equal(200);
			var body = JSON.parse(result.body);
			body.should.have.property("OK");
			body['OK'].should.have.property("contractState");
			body['OK'].should.have.property("event");
			body['OK'].should.have.property("initEvent");
			body['OK'].should.have.property("state");
			
			complete();
		})
	.catch(function (error) {
		//assert.fail(null, null, error);
		complete(error);
	})
	.done()
});

    
//-------------------------------------------------------------------------------------------//

it(" Should Read the contract object model ", function(complete) {	
	
	var readBody = {
			chaincodeSpec : {
			type : "GOLANG",
			chaincodeID : {
				name : contractId
			},
			ctorMsg : {
				function : "readContractObjectModel",
				args : []
			},
                "secureContext":secure_context
			}
	};
	
	var options = { 
		url : chaincodeURL,
		headers : {'Content-Type':'application/json'},
		body : JSON.stringify(readBody)
	};
	logger.info("Reading Contract object model...");
	var req = request.defaults(options);
	return internal.doRequest(null, "POST", req)
	.then(function (result) {
		if (result.error) {
			throw new Error("Failed to Read demo contract: " + result.error);
		}
					
		result.response.statusCode.should.be.equal(200);
		
		var body = JSON.parse(result.body);
		body.should.have.property("OK");
		body['OK'].should.have.property("version");
		body['OK']['version'].should.equal(contract_version);
		body['OK'].should.have.property("nickname");
		body['OK']['nickname'].should.equal("TRADELANE");
		body['OK'].should.have.property("activeAssets");
		//body['OK']['activeAssets'].should.equal('{}');
       
		complete();	
	})
	
	.catch(function (error) {
		//assert.fail(null, null, error);
		complete(error);
	})
	.done()
});	
     
//-------------------------------------------------------------------------------------------//

it(" Should Read the recent states ", function(complete) {	
	
	var readBody = {
			chaincodeSpec : {
			type : "GOLANG",
			chaincodeID : {
				name : contractId
			},
			ctorMsg : {
				function : "readRecentStates",
				args : []
			},
            "secureContext":secure_context
			}
	};
	
	var options = { 
		url : chaincodeURL,
		headers : {'Content-Type':'application/json'},
		body : JSON.stringify(readBody)
	};
	logger.info("Reading recent states...");
	var req = request.defaults(options);
	return internal.doRequest(null, "POST", req)
	.then(function (result) {
		if (result.error) {
			throw new Error("Failed to Read demo contract: " + result.error);
		}
					
		 result.response.statusCode.should.be.equal(200);
			var body = JSON.parse(result.body);
			body.should.have.property("OK");			
			
			var assetBody = JSON.parse(body['OK']);
			assetBody.should.be.instanceof(Array).and.have.lengthOf(3);
			
         var arrayBody  = assetBody[0];
			arrayBody.should.have.property("assetID");
			arrayBody.should.have.property("incompliance");
			arrayBody.should.have.property("lastEvent");
                arrayBody['lastEvent'].should.have.property("args");
                var eventBody = JSON.parse(arrayBody['lastEvent']['args']);
                eventBody.should.have.property("assetID");
                eventBody['assetID'].should.equal("ASSET8");
                eventBody.should.have.property("temperature");
                eventBody['temperature'].should.equal(-4);
			
            var arrayBody  = assetBody[1];
			arrayBody.should.have.property("assetID");
			arrayBody.should.have.property("incompliance");
			arrayBody.should.have.property("lastEvent");
                arrayBody['lastEvent'].should.have.property("args");
                var eventBody = JSON.parse(arrayBody['lastEvent']['args']);
                eventBody.should.have.property("assetID");
                eventBody['assetID'].should.equal("ASSET7");
                eventBody.should.have.property("temperature");
                eventBody['temperature'].should.equal(0);

           var arrayBody  = assetBody[2];
			arrayBody.should.have.property("alerts");
			arrayBody['alerts'].should.have.property("active");
			arrayBody['alerts'].should.have.property("cleared");
			arrayBody['alerts'].should.have.property("raised");
			arrayBody.should.have.property("assetID");
			arrayBody.should.have.property("incompliance");
			arrayBody.should.have.property("lastEvent");
                arrayBody['lastEvent'].should.have.property("args");
                var eventBody = JSON.parse(arrayBody['lastEvent']['args']);
                eventBody.should.have.property("assetID");
                eventBody['assetID'].should.equal("ASSET1");
                eventBody.should.have.property("temperature");
                eventBody['temperature'].should.equal(0.1);
                 
		complete();
		
	})
	
	.catch(function (error) {
		//assert.fail(null, null, error);
		complete(error);
	})
	.done()
});		

//-------------------------------------------------------------------------------------------//
    
    it(" Should Read the Asset History ", function(complete) {	
	
	var readBody = {
			chaincodeSpec : {
			type : "GOLANG",
			chaincodeID : {
				name : contractId
			},
			ctorMsg : {
				function : "readAssetHistory",
				args : [ "{\"assetID\":\"ASSET8\"}" ]
			},
             "secureContext":secure_context
			}
	};
	
	var options = { 
		url : chaincodeURL,
		headers : {'Content-Type':'application/json'},
		body : JSON.stringify(readBody)
	};
	logger.info("Reading the asset history...");
	var req = request.defaults(options);
	return internal.doRequest(null, "POST", req)
	.then(function (result) {
		if (result.error) {
			throw new Error("Failed to Read demo contract: " + result.error);
		}
					
		 result.response.statusCode.should.be.equal(200);
			var body = JSON.parse(result.body);
			body.should.have.property("OK");			
			
			var assetBody = JSON.parse(body['OK']);
			assetBody.should.be.instanceof(Array).and.have.lengthOf(1);
			
            var arrayBody  = assetBody[0];
			arrayBody.should.have.property("assetID");
			arrayBody.should.have.property("incompliance");
			arrayBody.should.have.property("lastEvent");
                arrayBody['lastEvent'].should.have.property("args");
                var eventBody = JSON.parse(arrayBody['lastEvent']['args']);
                eventBody.should.have.property("assetID");
                eventBody['assetID'].should.equal("ASSET8");
                eventBody.should.have.property("temperature");
                eventBody['temperature'].should.equal(-4);
				
		complete();	
	})
	
	.catch(function (error) {
		//assert.fail(null, null, error);
		complete(error);
	})
	.done()
});
    
//-------------------------------------------------------------------------------------------//


it(" Should update an asset and read asset - Bad temp scenario", function(complete) {
	var timestamp = new Date();
		
		var createBody = {
				chaincodeSpec : {
			    type : "GOLANG",
			    chaincodeID : {
			      name : contractId
			    },
			    ctorMsg : {
			      function : "updateAsset",
			      args : [ "{\"assetID\":\"ASSET8\",\"temperature\":3}" ]
			    },
                    "secureContext":secure_context
				}
			};
		
		var options = { 
				url : chaincodeURL,
				headers : {'Content-Type':'application/json'},
				body : JSON.stringify(createBody)
			};
		
		logger.info("Updating asset...");
		
		var req = request.defaults(options);
		return internal.doRequest(null, "POST", req)
		
	.then(function (result) {
		if (result.error) {
			throw new Error("Failed to invoke the contract: " + result.error);
		}		
		result.response.statusCode.should.be.equal(200);
		
		var body = JSON.parse(result.body);
		body.should.have.property("OK");
		body["OK"].should.equal("Successfully invoked chainCode.");
		body.should.have.property("message");
		messageId = body.message;
		
		return q.delay(timeout)	
	})
	
	.then(function () {
		
		var readBody = {
				chaincodeSpec : {
			    type: "GOLANG",
			    chaincodeID: {
			      name: contractId
			    },
			    ctorMsg: {
			      function: "readAsset",
			      args: [ "{\"assetID\":\"ASSET8\"}" ]
			    },
                    "secureContext":secure_context
				}
			};
		
		var options = { 
				url : chaincodeURL,
				headers : {'Content-Type':'application/json'},
				body : JSON.stringify(readBody) 
			};
		
		logger.info("Bad temperature - Reading an asset...");
		var req = request.defaults(options);
		return internal.doRequest(null, "POST", req)
	})
		.then(function (result) {	
			if (result.error) {
				throw new Error("Failed to invoke the contract: " + result.error);
			}
			result.response.statusCode.should.be.equal(200);
			var body = JSON.parse(result.body);
			body.should.have.property("OK");			
			
            body['OK'].should.have.property("alerts");
            body['OK']['alerts'].should.have.property("active");
            
            body['OK']['alerts']['active'].should.be.instanceof(Array).and.have.lengthOf(1);
            should.equal(body['OK']['alerts']['active'][0], true);
            
            body['OK']['alerts'].should.have.property("raised");
            body['OK']['alerts']['raised'].should.be.instanceof(Array).and.have.lengthOf(1);
            should.equal(body['OK']['alerts']['raised'][0], true);
            
            body['OK']['alerts'].should.have.property("cleared");
            body['OK']['alerts']['cleared'].should.be.instanceof(Array).and.have.lengthOf(1);
            should.equal(body['OK']['alerts']['cleared'][0], false);
            
			body['OK'].should.have.property("assetID");
            body['OK']['assetID'].should.equal("ASSET8");
			body['OK'].should.have.property("incompliance");
            should.equal(body['OK']['incompliance'], false);
			body['OK'].should.have.property("lastEvent");
			var eventBody = body['OK']['lastEvent'];
			eventBody.should.have.property("args");
			var assetBody = JSON.parse(eventBody['args']);
			assetBody.should.have.property("assetID");
			assetBody['assetID'].should.equal("ASSET8");
			assetBody.should.have.property("temperature");
			assetBody['temperature'].should.equal(3);
			
			complete();
	})
	.catch(function (error) {
		//assert.fail(null, null, error);
		complete(error);
	})
	.done()
});
    
//-------------------------------------------------------------------------------------------//


it(" Should update an asset and read asset - Good temp scenario", function(complete) {
	var timestamp = new Date();
		
		var createBody = {
				chaincodeSpec : {
			    type : "GOLANG",
			    chaincodeID : {
			      name : contractId
			    },
			    ctorMsg : {
			      function : "updateAsset",
			      args : [ "{\"assetID\":\"ASSET8\",\"temperature\":-3}" ]
			    },
                    "secureContext":secure_context
				}
			};
		
		var options = { 
				url : chaincodeURL,
				headers : {'Content-Type':'application/json'},
				body : JSON.stringify(createBody)
			};
		
		logger.info("Updating asset...");
		
		var req = request.defaults(options);
		return internal.doRequest(null, "POST", req)
		
	.then(function (result) {
		if (result.error) {
			throw new Error("Failed to invoke the contract: " + result.error);
		}		
		result.response.statusCode.should.be.equal(200);
		
		var body = JSON.parse(result.body);
		body.should.have.property("OK");
		body["OK"].should.equal("Successfully invoked chainCode.");
		body.should.have.property("message");
		messageId = body.message;
		
		return q.delay(timeout)	
	})
	
	.then(function () {
		
		var readBody = {
				chaincodeSpec : {
			    type: "GOLANG",
			    chaincodeID: {
			      name: contractId
			    },
			    ctorMsg: {
			      function: "readAsset",
			      args: [ "{\"assetID\":\"ASSET8\"}" ]
			    },
                    "secureContext":secure_context
				}
			};
		
		var options = { 
				url : chaincodeURL,
				headers : {'Content-Type':'application/json'},
				body : JSON.stringify(readBody) 
			};
		
		logger.info("Good temperature - Reading an asset...");
		var req = request.defaults(options);
		return internal.doRequest(null, "POST", req)
	})
		.then(function (result) {	
			if (result.error) {
				throw new Error("Failed to invoke the contract: " + result.error);
			}
			result.response.statusCode.should.be.equal(200);
			var body = JSON.parse(result.body);
			body.should.have.property("OK");			
			
            body['OK'].should.have.property("alerts");
            body['OK']['alerts'].should.have.property("active");
            
			body['OK'].should.have.property("assetID");
            body['OK']['assetID'].should.equal("ASSET8");
			body['OK'].should.have.property("incompliance");
            should.equal(body['OK']['incompliance'], true);
			body['OK'].should.have.property("lastEvent");
			var eventBody = body['OK']['lastEvent'];
			eventBody.should.have.property("args");
			var assetBody = JSON.parse(eventBody['args']);
			assetBody.should.have.property("assetID");
			assetBody['assetID'].should.equal("ASSET8");
			assetBody.should.have.property("temperature");
			assetBody['temperature'].should.equal(-3);
			
			complete();
	})
	.catch(function (error) {
		//assert.fail(null, null, error);
		complete(error);
	})
	.done()
});

//-------------------------------------------------------------------------------------------//


it(" Should update an asset and read asset", function(complete) {
	var timestamp = new Date();
		
		var createBody = {
				chaincodeSpec : {
			    type : "GOLANG",
			    chaincodeID : {
			      name : contractId
			    },
			    ctorMsg : {
			      function : "updateAsset",
			      args : [ "{\"assetID\":\"ASSET8\",\"location\":{\"latitude\":49,\"longitude\":-97},\"carrier\":\"UPS\"}" ]
			    },
                    "secureContext":secure_context
				}
			};
		
		var options = { 
				url : chaincodeURL,
				headers : {'Content-Type':'application/json'},
				body : JSON.stringify(createBody)
			};
		
		logger.info("Updating asset...");
		
		var req = request.defaults(options);
		return internal.doRequest(null, "POST", req)
		
	.then(function (result) {
		if (result.error) {
			throw new Error("Failed to invoke the contract: " + result.error);
		}		
		result.response.statusCode.should.be.equal(200);
		
		var body = JSON.parse(result.body);
		body.should.have.property("OK");
		body["OK"].should.equal("Successfully invoked chainCode.");
		body.should.have.property("message");
		messageId = body.message;
		
		return q.delay(timeout)	
	})
	
	.then(function () {
		
		var readBody = {
				chaincodeSpec : {
			    type: "GOLANG",
			    chaincodeID: {
			      name: contractId
			    },
			    ctorMsg: {
			      function: "readAsset",
			      args: [ "{\"assetID\":\"ASSET8\"}" ]
			    },
                    "secureContext":secure_context
				}
			};
		
		var options = { 
				url : chaincodeURL,
				headers : {'Content-Type':'application/json'},
				body : JSON.stringify(readBody) 
			};
		
		logger.info("Reading an asset...");
		var req = request.defaults(options);
		return internal.doRequest(null, "POST", req)
	})
		.then(function (result) {	
			if (result.error) {
				throw new Error("Failed to invoke the contract: " + result.error);
			}
			result.response.statusCode.should.be.equal(200);
			var body = JSON.parse(result.body);
			body.should.have.property("OK");			
			
			body['OK'].should.have.property("assetID");
            body['OK'].should.have.property("carrier");
			body['OK'].should.have.property("incompliance");
			body['OK'].should.have.property("lastEvent");
			var eventBody = body['OK']['lastEvent'];
			eventBody.should.have.property("args");
			var assetBody = JSON.parse(eventBody['args']);
			assetBody.should.have.property("assetID");
			assetBody['assetID'].should.equal("ASSET8");
			assetBody.should.have.property("location");
			assetBody['location'].should.have.property("latitude");
			assetBody['location'].should.have.property("longitude");
			assetBody['location']['latitude'].should.equal(49);
			assetBody['location']['longitude'].should.equal(-97);
			assetBody.should.have.property("carrier");
			assetBody['carrier'].should.equal("UPS");
			
			complete();
	})
	.catch(function (error) {
		//assert.fail(null, null, error);
		complete(error);
	})
	.done()
});
    
//-------------------------------------------------------------------------------------------//
	
	
	it(" Should delete an asset and read all assets", function(complete) {		
		var createBody = {
				chaincodeSpec : {
			    type : "GOLANG",
			    chaincodeID : {
			      name : contractId
			    },
			    ctorMsg : {
			      function : "deleteAsset",
			      args : [ "{\"assetID\":\"ASSET8\"}" ]
			    },
                      "secureContext":secure_context
				}
			};
		
		var options = { 
				url : chaincodeURL,
				headers : {'Content-Type':'application/json'},
				body : JSON.stringify(createBody) 
			};
		
		logger.info("Delete all assets...");
		var req = request.defaults(options);
		return internal.doRequest(null, "POST", req)
	.then(function (result) {
		if (result.error) {
			throw new Error("Failed to invoke the contract: " + result.error);
		}
					
		result.response.statusCode.should.be.equal(200);
		
		var body = JSON.parse(result.body);
		body.should.have.property("OK");
		body["OK"].should.equal("Successfully invoked chainCode.");
		body.should.have.property("message");
		messageId = body.message;

		return q.delay(timeout)	
	})
	
	.then(function () {
		
		var readBody = {
				chaincodeSpec : {
			    type: "GOLANG",
			    chaincodeID: {
			      name: contractId
			    },
			    ctorMsg: {
			      function: "readAllAssets",
			      args: [  ]
			    },
                "secureContext":secure_context
				}
			};
		
		var options = { 
				url : chaincodeURL,
				headers : {'Content-Type':'application/json'},
				body : JSON.stringify(readBody) 
			};
		
		logger.info("Read all assets...");
		var req = request.defaults(options);
		return internal.doRequest(null, "POST", req) 
	})
		.then(function (result) {	
			if (result.error) {
				throw new Error("Failed to invoke the contract: " + result.error);
			}
			result.response.statusCode.should.be.equal(200);
			var body = JSON.parse(result.body);
			body.should.have.property("OK");			
			
			var assetBody = JSON.parse(body['OK']);
			assetBody.should.be.instanceof(Array).and.have.lengthOf(2);
			
			var arrayBody  = assetBody[0];
			arrayBody.should.have.property("alerts");
			arrayBody['alerts'].should.have.property("active");
			arrayBody['alerts'].should.have.property("cleared");
			arrayBody['alerts'].should.have.property("raised");
			arrayBody.should.have.property("assetID");
			arrayBody.should.have.property("incompliance");
			arrayBody.should.have.property("lastEvent");
                arrayBody['lastEvent'].should.have.property("args");
                var eventBody = JSON.parse(arrayBody['lastEvent']['args']);
                eventBody.should.have.property("assetID");
                eventBody['assetID'].should.equal("ASSET1");
                eventBody.should.have.property("temperature");
                eventBody['temperature'].should.equal(0.1);
                
            var arrayBody  = assetBody[1];
			arrayBody.should.have.property("assetID");
			arrayBody.should.have.property("incompliance");
			arrayBody.should.have.property("lastEvent");
                arrayBody['lastEvent'].should.have.property("args");
                var eventBody = JSON.parse(arrayBody['lastEvent']['args']);
                eventBody.should.have.property("assetID");
                eventBody['assetID'].should.equal("ASSET7");
                eventBody.should.have.property("temperature");
                eventBody['temperature'].should.equal(0);
            
			complete();
	})
	.catch(function (error) {
		//assert.fail(null, null, error);
		complete(error);
	})
	.done()
	});	
    
//-------------------------------------------------------------------------------------------//
	
	it(" Should delete all asset and read all assets", function(complete) {		
		var createBody = {
				chaincodeSpec : {
			    type : "GOLANG",
			    chaincodeID : {
			      name : contractId
			    },
			    ctorMsg : {
			      function : "deleteAllAssets",
			      args : [  ]
			    },
                      "secureContext":secure_context
				}
			};
		
		var options = { 
				url : chaincodeURL,
				headers : {'Content-Type':'application/json'},
				body : JSON.stringify(createBody) 
			};
		
		logger.info("Delete all assets...");
		var req = request.defaults(options);
		return internal.doRequest(null, "POST", req)
	.then(function (result) {
		if (result.error) {
			throw new Error("Failed to invoke the contract: " + result.error);
		}
					
		result.response.statusCode.should.be.equal(200);
		
		var body = JSON.parse(result.body);
		body.should.have.property("OK");
		body["OK"].should.equal("Successfully invoked chainCode.");
		body.should.have.property("message");
		messageId = body.message;

		return q.delay(timeout)	
	})
	
	.then(function () {
		
		var readBody = {
				chaincodeSpec : {
			    type: "GOLANG",
			    chaincodeID: {
			      name: contractId
			    },
			    ctorMsg: {
			      function: "readAllAssets",
			      args: [  ]
			    },
                "secureContext":secure_context
				}
			};
		
		var options = { 
				url : chaincodeURL,
				headers : {'Content-Type':'application/json'},
				body : JSON.stringify(readBody) 
			};
		
		logger.info("Read all assets...");
		var req = request.defaults(options);
		return internal.doRequest(null, "POST", req) 
	})
		.then(function (result) {	
			if (result.error) {
				throw new Error("Failed to invoke the contract: " + result.error);
			}
			result.response.statusCode.should.be.equal(200);
			
			var body = JSON.parse(result.body);
			body.should.have.property("OK");
			body["OK"].should.equal("[]" );
			complete();
	})
	.catch(function (error) {
		//assert.fail(null, null, error);
		complete(error);
	})
	.done()
	});
		
//-------------------------------------------------------------------------------------------//
	
	it(" Invoking setCreateOnUpdate ", function(complete) {

		var createBody = {
				chaincodeSpec : {
			    type : "GOLANG",
			    chaincodeID : {
			      name : contractId
			    },
			    ctorMsg : {
			      function : "setCreateOnUpdate",
			      args : [ "{\"createOnUpdate\":false}"]
			    		},
                    "secureContext":secure_context
					}
				};
		
		var options = { 
				url : chaincodeURL,
				headers : {'Content-Type':'application/json'},
				body : JSON.stringify(createBody) //converts a value to JSON notation
				};
		
		logger.info("Setting CreateOnUpdate to false...");
		var req = request.defaults(options);
		return internal.doRequest(null, "POST", req)
		.then(function (result) {
		if (result.error) {
			throw new Error("Failed to invoke the contract: " + result.error);
		}
					
		result.response.statusCode.should.be.equal(200);
		
		var body = JSON.parse(result.body);
		body.should.have.property("OK");
		body["OK"].should.equal("Successfully invoked chainCode.");
		body.should.have.property("message");
		messageId = body.message;
        complete();
	})
	.catch(function (error) {
		//assert.fail(null, null, error);
		complete(error);
	})
	.done()
	});
    
//-------------------------------------------------------------------------------------------//
	
	it(" Invoking setLoggingLevel ", function(complete) {

		var createBody = {
				chaincodeSpec : {
			    type : "GOLANG",
			    chaincodeID : {
			      name : contractId
			    },
			    ctorMsg : {
			      function : "setLoggingLevel",
			      args : [ "{\"logLevel\":\"DEBUG\"}" ]
			    		},
                    "secureContext":secure_context
					}
				};
		
		var options = { 
				url : chaincodeURL,
				headers : {'Content-Type':'application/json'},
				body : JSON.stringify(createBody) //converts a value to JSON notation
				};
		
		logger.info("Setting LoggingLevel to DEBUG...");
		var req = request.defaults(options);
		return internal.doRequest(null, "POST", req)
		.then(function (result) {
		if (result.error) {
			throw new Error("Failed to invoke the contract: " + result.error);
		}			
		result.response.statusCode.should.be.equal(200);
		
		var body = JSON.parse(result.body);
		body.should.have.property("OK");
		body["OK"].should.equal("Successfully invoked chainCode.");
		body.should.have.property("message");
		messageId = body.message;
        complete();
	})
	.catch(function (error) {
		//assert.fail(null, null, error);
		complete(error);
	})
	.done()
	});
*/
    
});