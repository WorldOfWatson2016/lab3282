/*
Copyright (c) 2016 IBM Corporation and other Contributors.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.

Contributors:
Kim Letkeman - Initial Contribution
*/


// ************************************
// KL 14 Mar 2016 backport from 4.0
// KL 27 Mar 2016 support for loose JSON-RPC naming for 3.0.5
// ************************************

package main // sitting beside the main file for now

import (
    "fmt"
    "strings"
    "reflect"
    "encoding/json"
)

// CASESENSITIVEMODE defines whether property names in the EVENT have to strictly 
// follow JSON RPC conventions of case matching. Default is loose matching, but
// secure environments should turn this to true.
var CASESENSITIVEMODE = false

// finds an object by its qualified name, which looks like "location.latitude"
// as one example. Returns as map[string]interface{} 
func getObject (objIn interface{}, qname string) (interface{}, bool) {
    // return a copy of the selected object
    // handles full qualified name, starting at object's root
    obj, found := objIn.(map[string]interface{})
    if !found {
        obj, found = objIn.(ArgsMap)
        if !found {
            log.Errorf("getObject passed a non-map / non-ArgsMap: %#v", objIn)
            return nil, false
        }
    }
    searchObj := map[string]interface{}(obj)
    s := strings.Split(qname, ".")
    // crawl the levels
    for i, v := range s {
        //fmt.Printf("**** FIND level [%d] %s in %+v\n", i, v, searchObj)
        if i+1 < len(s) {
            tmp, found := searchObj[v]
            //fmt.Printf("** tmp is %+v\n", tmp)
            if found {
                searchObj, found = tmp.(map[string]interface{})
                //fmt.Printf("** tmp->searchObj AS MAP is %+v\n", searchObj)
                if !found {
                    searchObj, found = tmp.(ArgsMap)
                    //fmt.Printf("** tmp->searchObj AS ARGSMAP is %+v\n", searchObj)
                }
            }
            if !found {
                log.Warningf("getObject cannot find level or is not map shape: %s", v)
                return nil, false
            }
        } else {
            returnObj, found := searchObj[v]
            if !found {
                log.Warningf("getObject cannot find final level: %s", v)
                return nil, false
            }
            return returnObj, true
        }
    }
    return nil, false
}

func getObjectAsString(objIn interface{}, qname string) (string, bool) {
    tbytes, found := getObject(objIn, qname)
    if found {
        t, found := tbytes.(string)
        if found {
            return t, true
        }
    }
    log.Warningf("getObjectAsString object is not a string: %s", qname)
    return "", false
}

func getObjectAsBoolean(objIn interface{}, qname string) (bool, bool) {
    tbytes, found := getObject(objIn, qname)
    if found {
        t, found := tbytes.(bool)
        if found {
            return t, true
        }
    }
    log.Warningf("getObjectAsBoolean object is not a boolean: %s", qname)
    return false, false
}

func getObjectAsNumber(objIn interface{}, qname string) (float64, bool) {
    tbytes, found := getObject(objIn, qname)
    if found {
        t, found := tbytes.(float64)
        if found {
            return t, true
        }
    }
    log.Warningf("getObjectAsNumber object is not a number (float64): %s", qname)
    return 0, false
}

func getObjectAsInteger(objIn interface{}, qname string) (int, bool) {
    tbytes, found := getObject(objIn, qname)
    if found {
        t, found := tbytes.(int)
        if found {
            return t, found
        }
    }
    log.Warningf("getObjectAsInteger object is not an integer: %s", qname)
    return 0, found
}

// this small function isolates the getting of the object in case
// sensitive or case insensitive modes because they are quite different
// we must not modify the destination key 

func findObjectByKey (objIn interface{}, key string) (interface{}, bool) {
    objMap, found := objIn.(map[string]interface{})
    if found {
        dstKey, found := findMatchingKey(objMap, key)
        if found {
            objOut, found := objMap[dstKey]
            if found { 
                return objOut, found 
            }
        }
    }
    return nil, false
}

// finds a key that matches the incoming key, very useful to remove the 
// complexity of switching case insensitivity because we always need
// the destination key to stay intact to avoid making copies of that
// substructure as we copy fields from the incoming structure 
func findMatchingKey (objIn interface{}, key string) (string, bool) {
    objMap, found := objIn.(map[string]interface{})
    if !found {
        // not a map, cannot proceed
        log.Warningf("findMatchingKey objIn is not a map shape %+v", objIn)
        return "", false
    }
    if CASESENSITIVEMODE {
        // we can just use the key directly
        _, found := objMap[key] 
        return key, found
    }
    // we must visit all keys and compare using tolower on each side
    for k := range objMap {
        if strings.ToLower(k) == strings.ToLower(key) {
            log.Debugf("findMatchingKey found match! %+v %+v", k, key)
            return k, true
        }
    }
    log.Warningf("findMatchingKey did not find key %+v", key)
    return "", false
}

// in a contract, src is usually the incoming update event, 
// and dst is the existing state from the ledger 

func contains(arr interface{}, val interface{}) bool {
    switch t := arr.(type) {
        case []string:
            arr2 := arr.([]string)
            for _, v := range arr2 {
                if v == val {
                    return true
                }
            }
        case []int:
            arr2 := arr.([]int)
            for _, v := range arr2 {
                if v == val {
                    return true
                }
            }
        case []float64:
            arr2 := arr.([]float64)
            for _, v := range arr2 {
                if v == val {
                    return true
                }
            }
        case []interface{}:
        //todo: try cast instead of assertion
        //todo: use schema to determine if we even call this function or just add the value
            arr2 := arr.([]interface{})
            for _, v := range arr2 {
                switch tt := val.(type) {
                    case string:
                        if v.(string) == val.(string) { return true }
                    case int:
                        if v.(int) == val.(int) { return true }
                    case float64:
                        if v.(float64) == val.(float64) { return true }
                    case interface{}:
                        if v.(interface{}) == val.(interface{}) { return true }
                    default:
                        log.Errorf("contains passed array containing unknown type: %+v\n", tt);
                        return false
                }
            }
        default:
            log.Errorf("contains passed array of unknown type: %+v\n", t);
            return false
    }
    return false
}

// deep merge src into dst and return dst
func deepMerge(srcIn interface{}, dstIn interface{}) (map[string]interface{}){
    src, found := srcIn.(map[string]interface{})
    if !found {
        log.Criticalf("Deep Merge passed source map of type: %s", reflect.TypeOf(srcIn)) 
        return nil 
    }
    dst, found := dstIn.(map[string]interface{})
    if !found {
        log.Criticalf("Deep Merge passed dest map of type: %s", reflect.TypeOf(dstIn)) 
        return nil 
    }
    for k, v := range src {
        switch v.(type) {
            case map[string]interface{}:
                // don't try hoisting dstKey calculation
                dstKey, found := findMatchingKey(dst, k)
                if found {
                    dstChild, found := dst[dstKey].(map[string]interface{})
                    if found {
                        // recursive deepMerge into existing key
                        dst[dstKey] = deepMerge(v.(map[string]interface{}), dstChild)
                    } 
                } else {
                    // copy entire map to incoming key
                    dst[k] = v
                }
            case []interface{}:
                dstKey, found := findMatchingKey(dst, k)
                if found {
                    dstChild, found := dst[dstKey].([]interface{})
                    if found {
                        // union
                        for elem := range v.([]interface{}) {
                            if !contains(dstChild, elem) {
                                dstChild = append(dstChild, elem)
                            }
                        } 
                    }
                } else {
                    // copy
                    dst[k] = v
                }
            default:
                // copy discrete types 
                dstKey, found := findMatchingKey(dst, k)
                if found {
                    dst[dstKey] = v
                } else {
                    dst[k] = v
                }
        }
    }
    return dst
}

// returns a string that is nicely indented
// if json fails for some reason, returns the %#v representation
func prettyPrint(m interface{}) (string) {
    bytes, err := json.MarshalIndent(m, "", "  ")
    if err == nil {
        return string(bytes)
    }
    return fmt.Sprintf("%#v", m) 
}