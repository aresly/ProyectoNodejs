'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsuariosSchema = Schema({
    n_usuario: { type: Number, require: true},
    nombre: { type: String, require: true},
    edad: { type: Number, require: true},
    email: { type: String, require: true},
    password: { type: String, require: true},  
});


module.exports = mongoose.model('usuarios', UsuariosSchema);