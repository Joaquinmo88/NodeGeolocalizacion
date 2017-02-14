'use strict'

const express = require("express");
const app 		= express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

const socketConfig = function(){
  io.sockets.on('connection', function(socket){
    socket.emit('getEmpleados', 'Hola Mindo sss');
  });
}

module.exports = socketConfig;
