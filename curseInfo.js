var auth = require("./l2pAuth");
auth.setClientID('Se8Uit5Hd244cltskaVUpHFVXaZ6exvKVTKsKhKTH70yTlPlWoHHUR5RFsy30nV.app.rwth-aachen.de')
auth.getTokens("TVJpNoNT4k5l9Sk7AQowsPkaBKGjWf8R",function(response){
	console.log("TOKEN RETURN:")
	console.log(response);
	auth.curseinfo(response.access_token,function(response){
		console.log("COURSE INFO RETURN:")
		console.log(response);
	})
});