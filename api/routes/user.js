'use strict'

var express = require('express');
var UserController = require('../controllers/user');

//subir imagen
var multipart = require('connect-multiparty');

var md_upload = multipart({
    uploadDir: './uploads/users'
})

var api = express.Router();
var md_auth = require('../middleware/authenticated');

api.get('/probando-controlador', md_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser); //id? si quiero el parametro opcional
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload ], UserController.uploadImage); //id? si quiero el parametro opcional
api.get('/get-image-user/:imageFile', UserController.getImageFile); //id? si quiero el parametro opcional



module.exports = api;