var request = require('request');
var clientID = '';
var obtainURL = 'https://oauth.campus.rwth-aachen.de/oauth2waitress/oauth2.svc/code';
var tokenURL = 'https://oauth.campus.rwth-aachen.de/oauth2waitress/oauth2.svc/token';
var tokenInfoURL = 'https://oauth.campus.rwth-aachen.de/oauth2waitress/oauth2.svc/tokeninfo';

function setClientID(id){
  clientID = id;
}

function obtainUserCode(callback){
request.post({url:obtainURL, form: {client_id:clientID, scope:'l2p.rwth userinfo.rwth'}}, 
  function(err,httpResponse,body){ 
    if (!err && httpResponse.statusCode == 200) {
      var parsed = JSON.parse(body);
      parsed.verification_url = parsed.verification_url + "?q=verify&d=" + parsed.user_code;
      callback(parsed);
    } else {
      console.log("error");
    }
  });
}


function getTokens(device_code, callback){
  request.post({url:tokenURL, form: {client_id:clientID, code:device_code, grant_type:'device'}}, 
  function(err,httpResponse,body){ 
    if (!err && httpResponse.statusCode == 200) {
      var parsed = JSON.parse(body);
      if(parsed.status == "error: authorization pending"){
          //User has not yet authorized
      } else if (parsed.status == "error: slow down"){
          //To many requests
      } else {
        callback(parsed);
      }
    } else {
      console.log("error");
    }
  });
}

function refreshToken(refreshToken, callback){
  request.post({url:tokenURL, form: {client_id:clientID, refresh_token:refreshToken, grant_type:'refresh_token'}},
    function(err,httpResponse,body){ 
    if (!err && httpResponse.statusCode == 200) {
      var parsed = JSON.parse(body);
      callback(parsed);
    } else {
      console.log("error");
    }
  });
}

function invalidateToken(refreshToken){
  request.post({url:tokenURL, form: {client_id:clientID, refresh_token:refreshToken, grant_type:'invalidate'}},
    function(err,httpResponse,body){ 
    if (!err && httpResponse.statusCode == 200) {
      //null
    } else {
      console.log("error");
    }
  });
}

function tokenValidation(accessToken, callback){
request.post({url:tokenInfoURL, form: {client_id:clientID, access_token:accessToken}},
    function(err,httpResponse,body){ 
    if (!err && httpResponse.statusCode == 200) {
      var parsed = JSON.parse(body);
      callback(parsed);
    } else {
      console.log("error");
    }
  });
}

function curseinfo(token,callback){
  var header = "Bearer "+token
  var options = {
  url: 'https://www2.elearning.rwth-aachen.de/api/courseinfo',
  headers: {
    "Authorization" : header
  }
  };
  request(options,callback);
}

function callAPI(token,apiurl,callback){
  var header = "Bearer "+token
  var options = {
  url: apiurl,
  headers: {
    "Authorization" : header
  }
  };
  request(options,callback);
}

exports.setClientID = setClientID;
exports.refreshToken = refreshToken;
exports.getTokens = getTokens;
exports.obtainUserCode = obtainUserCode;
exports.curseinfo = curseinfo;
exports.callAPI = callAPI;
exports.tokenValidation = tokenValidation;
exports.invalidateToken = invalidateToken;

