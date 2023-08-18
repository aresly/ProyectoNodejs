'use strict'

const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);


var UsuarioModel = require('../models/usuarios');

var UsuariosController = {
    
    get_usuarios: function(req, res){

        UsuarioModel.find({}).then((data) => {
            return res.status(200).send({
                status: 200, 
                message: "Productos encontrados",
                usuarios: data
            });
        }).catch((err) => {
            return res.status(500).json({status: 500, message: "Error en la busqueda"});
        });
    
    },
    get_usuario: function(req, res){


        let params = req.params;
        UsuarioModel.find({n_usuario:params.n_usuario}).then((data) => {
            if(data.length == 0) return res.status(404).json({status: 404, message: "No se encontró al usuario"});
            return res.status(200).send({
                status: 200, 
                message: "Usuario encontrado",
                usuarios: data
            });
        }).catch((err) => {
            return res.status(500).json({status: 500, message: "Error en la busqueda"});
        });
  
    },

    post_usuarios: (req, res) => {

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(422).json({ errors: errors.array() })
        }

        var body = req.body;

        UsuarioModel.find({n_usuario:body.n_usuario}).then((data) => {
            if(data.length > 0) return res.status(400).json({status: 400, message: "El Usuario ya existe"});
        
            var users_model = new UsuarioModel();
            var password_bcrypt = bcrypt.hashSync(body.password, salt);

            users_model.n_usuario = body.n_usuario;
            users_model.nombre = body.nombre;
            users_model.edad = body.edad;
            users_model.email = body.email;
            users_model.password = password_bcrypt;

            users_model.save().then((usersStored) => {
                if(!usersStored) return res.status(404).json({status: 404, message: "No se pudo almacenar el registro"});
                
                return res.status(200).send({
                    status: 200,
                    message: "Usuario almacenado",
                });
            })
            .catch(err =>{
                if(err) return res.status(500).json({status: 500, message: err});
            })    

        }).catch((err) => {
            return res.status(500).json({status: 500, message: "Error en la busqueda"});
        });

        
        
    },
    delete_usuarios: (req, res) => {

        let params = req.params;
        UsuarioModel.findOneAndRemove({n_usuario:params.n_usuario}).then((usersRemoved) => {
            if(!usersRemoved) return res.status(400).json({status: 400, message: "Los datos ingresados son incorrectos"});
            return res.status(200).send({
                status: 200, 
                message: "Usuario eliminado"
            });
        }).catch((err) => {
            return res.status(500).json({status: 500, message: "Error al eliminar"});
        });
    },
    update_usuarios: (req, res) => {

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(422).json({ errors: errors.array() })
        }
        let params = req.params;
        var body = req.body;
    

        let user_info = {
            nombre: body.nombre,
            edad: body.edad,
            email: body.email,
            password: body.password
        }


        UsuarioModel.findOneAndUpdate({n_usuario:params.n_usuario}, {$set:{
            nombre: body.nombre,
            edad: body.edad,
            email: body.email,
            password: body.password
        }}).then((data) => {
            if(!data) return res.status(404).json({status: 404, message: "No se encontró al usuario"});
            console.log(data);
            return res.status(200).send({
                status: 200, 
                message: "Usuario actualizado",
                data: data
            });
        }).catch((err) => {
            console.log(err);
            return res.status(500).json({status: 500, message: err});
            
        });

   
    }
}

module.exports = UsuariosController;