'use strict'

var passport = require('passport');
const passportConfig = function(server){

  server.use(passport.initialize());
  server.use(passport.session());

  passport.serializeUser(function(user, done){
    done(null, user);
  });
  passport.deserializeUser(function(user, done){
    done(null, user);
  });

  require('./local')(server);
};

module.exports = passportConfig;
