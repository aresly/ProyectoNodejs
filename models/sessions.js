'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsessionsSchema = Schema({
    usuario_id: { type: String, require: true, unique: true},
    jwt: { type: String }  
});


module.exports = mongoose.model('sessions', UsessionsSchema);