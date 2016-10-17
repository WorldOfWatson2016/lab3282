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
// KL: May 31 2016

// Config file to test IoT Blockchain Tradelane Contract version - 3.0.5


var Config = {
    protocol: "http", //http
    host: "localhost",
    port: 3000, 
    secure_context: "user_type0_xxxxx",
    enroll_secret: "xxxxx",
    debug_mode: true,
    path: "path to contract to deploy",
    name: "mycc",
    nickname: "TestContractSanity",
    contract_version: "4.1"
}; 

module.exports = Config;


