'use strict'

var express = require('express');
var SongController = require('../controllers/song');
var md_auth = require('../middleware/authenticated');

var api = express.Router();

//middleware para ficheros
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/songs'});

api.get('/song/:id', md_auth.ensureAuth, SongController.getSong);
api.get('/songs/:album?', md_auth.ensureAuth, SongController.getSongs);
api.post('/song-save', md_auth.ensureAuth, SongController.saveSong);
api.put('/song-update/:id', md_auth.ensureAuth, SongController.updateSong);
api.delete('/song-delete/:id', md_auth.ensureAuth, SongController.deleteSong);
api.post('/upload-file-song/:id', [md_auth.ensureAuth, md_upload], SongController.uploadFile);
api.get('/get-song-file/:songFile', md_auth.ensureAuth, SongController.getSongFile);


module.exports = api;