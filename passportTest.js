var passport = require("passport")
var BearerStrategy = require("passport-http-bearer").Strategy
var express = require('express')

passport.use(new BearerStrategy(
  function(token, done) {
    User.findOne({ token: token }, function (err, user) {
      if (err) { 
      	console.log("err" + err);
      	return done(err); }
      if (!user) { 
      	console.log("no user");
      	return done(null, false); }
      	console.log("success");
      return done(null, user, { scope: 'read' });
    });
  }
));


var app = express.createServer();

// configure Express
app.configure(function() {
  app.use(express.logger());
  // Initialize Passport!  Note: no need to use session middleware when each
  // request carries authentication credentials, as is the case with HTTP
  // Bearer.
  app.use(passport.initialize());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});


// curl -v http://127.0.0.1:3000/?access_token=123456789
app.get('/',
  // Authenticate using HTTP Bearer credentials, with session support disabled.
  passport.authenticate('bearer', { session: false }),
  function(req, res){
    res.json({ username: req.user.username, email: req.user.email });
  });

app.listen(3000);