'use strict'

var express = require('express');
var { body } = require('express-validator');
var api = express.Router();
var UsuariosController = require('../controllers/usuarios');
var AuthController = require('../controllers/auth');

let userProtectUrl = require('../middlewares/authUser').userProtectUrl;

/*------------USUARIOS-------------*/
api.get('/usuarios', UsuariosController.get_usuarios);
api.get('/usuario/:n_usuario', UsuariosController.get_usuario);
api.post('/usuarios', userProtectUrl,[
    body('n_usuario').not().isEmpty(),
    body('nombre').not().isEmpty(),
    body('edad').not().isEmpty(),
    body('email').not().isEmpty(),
    body('password').not().isEmpty()
],UsuariosController.post_usuarios);
api.delete('/usuarios/:n_usuario', UsuariosController.delete_usuarios);
api.put('/usuarios/:n_usuario',UsuariosController.update_usuarios);

/*---------LOGIN-------*/
api.post('/login',[
    body('email').not().isEmpty(),
    body('password').not().isEmpty()
], AuthController.login);

/*---------LOGOUT-------*/
api.post('/logout', userProtectUrl, AuthController.logout);



module.exports = api;