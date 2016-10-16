package main

var samples = `
{
    "contractState": {
        "activeAssets": [
            "The ID of a managed asset. The resource focal point for a smart contract."
        ],
        "nickname": "ELEVATOR",
        "version": "The version number of the current contract"
    },
    "event": {
        "assetID": "The ID of a managed asset. The resource focal point for a smart contract.",
        "power": 123.456,
        "speed": 123.456,
        "system": {
            "cpu": 123.456,
            "memory": 123.456
        },
        "temperature": 123.456,
        "threshold": 123.456,
        "weight": 123.456
    },
    "initEvent": {
        "nickname": "ELEVATOR",
        "version": "The ID of a managed asset. The resource focal point for a smart contract."
    },
    "state": {
        "assetID": "The ID of a managed asset. The resource focal point for a smart contract.",
        "power": 123.456,
        "speed": 123.456,
        "system": {
            "cpu": 123.456,
            "memory": 123.456
        },
        "temperature": 123.456,
        "weight": 123.456
    }
}`