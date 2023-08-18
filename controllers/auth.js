'use strict'
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);

var UsuarioModel = require('../models/usuarios');
var SessionsModel = require('../models/sessions');

var AuthController = {
    login: function(req, res){
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(422).json({ errors: errors.array() })
        }

        var body = req.body;


        let params = req.params;

        UsuarioModel.find({email:body.email}).then((data) => {
            
            if(data.length == 0) return res.status(404).json({status: 404, message: "No se encontró al usuario"});

            if(bcrypt.compareSync(body.password, data[0].password)){
                
                const payload = {
                    usuario_id : data[0]._id
                };
    
                const access_token = jwt.sign(payload,'1e0b89b95fa93380ff0101b072735d896a72d67da6238e218c48f062f6b8d7e1ce04362a6ba2a2e76ebbc610d2f072038c3a00b8d7338148c4efcdce4d875b9a',{expiresIn: '1d'});
    
                let update = {
                    usuario_id: data[0]._id,
                    jwt: access_token
                };
    
                SessionsModel.findOneAndUpdate({usuario_id: data[0]._id},update,{upsert:true, new:true}).then((sessionsupdate) => {
                    if(!sessionsupdate) return res.status(400).json({status: 400, message: "Los datos ingresados son incorrectos"});
                    return res.status(200).send({
                        status: 200, 
                        message: "Autenticacion correcta",
                        token: access_token
                    });
                }).catch((err) => {
                    return res.status(500).json({status: 500, message: "Error en el token"});
                });
    


            }else{
                return res.status(400).json({status: 400, message: "La contraseña es incorrecta"});

            }
    
        }).catch((err) => {
            console.log(err);
            return res.status(500).json({status: 500, message: "Error en la busqueda"});
        });
  
    },
    logout: function(req, res){
        SessionsModel.findOneAndRemove({usuario_id: req.decoded.usuario_id}).then((sessionDeleted) => {
            if(!sessionDeleted) return res.status(400).json({status: 400, message: "Los datos son incorrectos"});
            return res.status(200).send({
                status: 200, 
                message: "Usuario salió correctamente"
            });
        }).catch((err) => {
            return res.status(500).json({status: 500, message: "Error en el token"});
        });
    }
}

module.exports = AuthController;