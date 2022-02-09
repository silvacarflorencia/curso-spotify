'use strict'

var express = require('express');
var AlbumController = require('../controllers/album');

var api = express.Router();
var md_auth = require('../middleware/authenticated');

//middleware para ficheros
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/albums'});

api.get('/album/:id',md_auth.ensureAuth, AlbumController.getAlbum);
api.get('/albums/:artist',md_auth.ensureAuth, AlbumController.getAll);
api.post('/album-save', md_auth.ensureAuth,AlbumController.saveAlbum);
api.put('/album-update/:id', md_auth.ensureAuth, AlbumController.updateAlbum);
api.delete('/album-delete/:id', md_auth.ensureAuth, AlbumController.deleteAlbum);
api.post('/upload-image-album/:id', [md_auth.ensureAuth, md_upload], AlbumController.uploadImage)
api.get('/get-image-album/:imageFile', AlbumController.getImageFile);

module.exports = api;