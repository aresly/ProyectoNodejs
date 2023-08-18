'use strict'
const jwt = require('jsonwebtoken');
let SessionsModel = require('../models/sessions');

const middlewares = {
    userProtectUrl: (req, res, next) => {

        const token = req.headers['access-token'];
        if(token){
            jwt.verify(token,'1e0b89b95fa93380ff0101b072735d896a72d67da6238e218c48f062f6b8d7e1ce04362a6ba2a2e76ebbc610d2f072038c3a00b8d7338148c4efcdce4d875b9a', (err,decoded) => {
                if(err){
                    return res.status(403).json({status: 403, message: "Error en el token"});
                }else{
                    req.decoded = decoded;
                    SessionsModel.findOne({usuario_id: req.decoded.usuario_id, jwt: token}).then((session) => {
                        if(!session) return res.status(404).json({status: 404, message: "Los datos de autenticación son incorrectos"});
                        next();
                        
                    }).catch((err) => {
                        return res.status(500).json({status: 500, message: "Error al devolver los datos"});
                    });
                }
            })

        

        }else{
            res.status(403).send({
                message: "Token no valido"
            });
        }

    }
};
module.exports = middlewares;
