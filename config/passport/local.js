'use strict'

const Empleado = require('../../models/empleados');
const passport = require('passport')
  , localStrategy = require('passport-local').Strategy;

const localConfig = function(server){
    passport.use(new localStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, function(email, password, done){
        Empleado.findOne({'email': email}, (err, empleado) =>  {
          console.log('passport')
          if (err) { return done(err); }
          if(!empleado){
            return done(null, false, {message: `El usuario no se enceuntra ${email}` });
          }else{

            if(empleado.password == password){

              return done(null, empleado);
            }else{
              return done(null, false, {message: `El password no es correcto`});
            }

          }
        });
    }
  ));

  server.post('/login/', passport.authenticate('local', {
      successRedirect: '/home',
      failureRedirect: '/',
      failureFlash: true,
  }));

  /*server.post('/registro/', passport.authenticate('local', {
      successRedirect: '/home',
      failureRedirect: '/',
      failureFlash: true,
  }));*/

};

module.exports = localConfig;
