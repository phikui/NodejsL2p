var auth = require("./l2pAuth");
auth.getTokens("TVJpNoNT4k5l9Sk7AQowsPkaBKGjWf8R",function(response){
	//console.log(response);
	auth.curseinfo(response.access_token,function(response){
		console.log(response);
	})
});