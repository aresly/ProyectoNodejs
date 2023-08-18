'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3000;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://0.0.0.0:27017/proyecto', { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('Conexion a la base de datos establecida con exito');

        //Crear el servidor
        var server = app.listen(port, ()=>{
            console.log("Servidor corriendo correctamente en la url http://localhost: "+port);
        }); 
        server.timeout = 120000;
    })
    .catch(err => console.log(err));

