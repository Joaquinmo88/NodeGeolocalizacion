'use strict'

const Empleado = require('../models/empleados');

// function saveEmpleado(req, res){
//
//   let objEmpleado = new Empleado({
//     nombre : req.body.nombre,
//     email : req.body.email,
//     password : req.body.password,
//     password_confirmation : req.body.password_confirmation, // virtual
//     origen : "Indefinido",
//     destino : "Indefinido",
//     activo : 0
//   });
//
//   objEmpleado.save((err, empleadoStored) => {
//     if(err){
//       console.log(`Error al isertar empleado: ${err}`)
//     }else{
//       console.log(`Se inserto correctamente: ${empleadoStored}`)
//       //io.sockets.emit('getUsers', username);
//     }
//   });
// }


function getDataEmpleado(req, res){
  if(req.user){
    Empleado.findOneAndUpdate({_id: req.user._id}, {activo: 1}).exec(function(err, curso, count){
       req.session.user_id = req.user._id;
       res.render('home', { title: 'Express', data: req.user });
	  });
  }else{
    res.redirect('/');
  }
}

function logaut(req, res){
  Empleado.findOneAndUpdate({_id: req.user._id}, {activo: 0}).exec(function(err, curso, count){
    req.session.destroy(function(err) {
      console.log(err);
    });
    res.redirect('/');
  });
}

module.exports = {
  getDataEmpleado,
  logaut
}
