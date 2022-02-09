'use strict'
//middleware metodo que se ejecuta antes que se realce la accion del controlador
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_curso'

exports.ensureAuth = function(req, res, next){
    if(!req.headers.authorization){
        return res.status(403).send({messge: "La peticion no tiene la cabecera de autenticacion"})
    }else{
        var token = req.headers.authorization.replace(/['"]+/g, '');

        try{
            var payload = jwt.decode(token, secret);
            if(payload.exp <= moment().unix()){
                return res.status(401).send({message: 'Token ha expirado'})
            }
        }catch(ex){
           // console.log(ex);
            return res.status(403).send({messge: "EL token no es valido"})
        }
        //se le agrega a req el objeto user
        req.user = payload;

        next(); //sale del middleware
    }

}