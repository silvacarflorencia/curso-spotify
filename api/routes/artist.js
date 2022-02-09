'use strict'

var express = require('express');
var ArtistController = require('../controllers/artist');

var api = express.Router();
var md_auth = require('../middleware/authenticated');

//middleware para ficheros
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/artists'});

api.get('/artist/:id', ArtistController.getArtist);
api.get('/artists/:page?', ArtistController.getAll); //pages? si quiero el parametro opcional
api.post('/artist-save', ArtistController.saveArtist);
api.put('/artist-update/:id', md_auth.ensureAuth, ArtistController.updateArtist);
api.delete('/artist-delete/:id', md_auth.ensureAuth, ArtistController.deleteArtist);
api.post('/upload-image-artist/:id', [md_auth.ensureAuth, md_upload], ArtistController.uploadImage)
api.get('/get-image-artists/:imageFile', ArtistController.getImageFile); //id? si quiero el parametro opcional



module.exports = api;