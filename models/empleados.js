'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const EmpleadoSchema = Schema({
  nombre: String,
  email: {
    type: String,
    lowercase: true,
    required: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Correo no valido"]
  },
  password: { type: String, required: true, minlength: ['8','La contraseña es muy corta']},
  origen: String,
  destino: String,
  activo: {type: Number, default: 0 },
});

EmpleadoSchema.virtual("password_confirmation").get(function(){
    return this.c_password;
}).set(function(password){
  this.c_password = password;
});

module.exports = mongoose.model('Empleado', EmpleadoSchema);
