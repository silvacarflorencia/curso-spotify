'use strict'
//models
var Album = require('../models/album');
var Song = require('../models/song');

//cargar ficheros
var fs = require('fs');
var path = require('path');

//paginacion
var mongoosePaginate = require('mongoose-pagination');

function getAlbum(req, res){
    var albumId = req.params.id;

    //populate, devuelve el objeto fk
    Album.findById(albumId).populate({path: 'artist'}).exec((err, album) => {
        if(err){
            res.status(500).send({message: 'Error en la peticion'})
        }else{
            if(album){
                res.status(200).send({album: album})
            }else{
                res.status(404).send({message: 'El album no existe'})
            }
        }
    })
}

function saveAlbum(req, res){
    var album = new Album();
    var params = req.body;
 
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    album.save((err, albumStored) =>{
        console.log(albumStored)
        if(err){
            res.status(500).send({message: "Error en la peticion"})
        }else{
            if(!albumStored){
                res.status(404).send({message: "No se guardo Album"}) 
            }else{
                res.status(200).send({album: albumStored}) 
            }
        }
    })
}

function getAll(req, res){
    var artistId = req.params.artist;

    if(!artistId){
        //Sacar todos los albums de la bd
        var find = Album.find({}).sort('title');
    }else{
        //sacar los album de un artista
        var find = Album.find({artist:artistId}).sort('year')

    }
    find.populate({path: 'artist'}).exec((err, albums) =>{
        if(err){
            res.status(500).send({message: "Error en la peticion"})
        }else{
            if(!albums){
                res.status(404).send({message: "No se obtuvieron albums"}) 
            }else{
                res.status(200).send({albums}) 
            } 
        }
    })
}

function updateAlbum(req, res){
    var albumId = req.params.id;
    var update = req.body;

    Album.findByIdAndUpdate(albumId, update).populate({path: 'artist'}).exec((err, albumUpdated) => {
   // Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) =>{
        if(err){
            res.status(500).send({message: "Error en la peticion"})
        }else{
            if(!albumUpdated){
                res.status(404).send({message: "No se alcualizo Album"}) 
            }else{
                res.status(200).send({album: albumUpdated}) 
            }
        }
    })
}

function deleteAlbum(req, res){
    var albumId = req.params.id;
    
    Album.findByIdAndRemove(albumId, (err, albumRemoved) =>{
        if(err){
            res.status(500).send({message: "Error en la peticion"})
        }else{
            if(!albumRemoved){
                res.status(404).send({message: "No se borro Album"}) 
            }else{
                Song.find({song: albumRemoved._id}).deleteOne((err, songRemoved) =>{
                    if(err){
                        res.status(500).send({message: "Error al eliminar el song"})
                    }else{
                        if(!songRemoved){
                            res.status(404).send({message: "El song no ha sido eliminado"}) 
                        }else{
                            res.status(200).send({artis: artistRemoved});
                        }
                    }
                })
                res.status(200).send({album: albumRemoved}) 
            }
        }
    })
}

function uploadImage(req, res){
    var albumId = req.params.id;
    var file_name = 'No subido...';

    if(req.files){
       var file_path = req.files.image.path;
       var file_split = file_path.split('\\');
       var file_name = file_split[2];

       var ext_split = file_name.split('.');
       var file_ext = ext_split[1];

       if(file_ext == 'png' || file_ext == 'jpeg' || file_ext == 'jpg' || file_ext == 'gif'){
            Album.findByIdAndUpdate(albumId, {image: file_name}, (err, albumUpdated) =>{
                if(!albumUpdated){
                    res.status(404). send({message : 'No se ha registrado el usuario'}) 
                }else{
                    res.status(200). send({album : albumUpdated}) ;
                }
            })
       }else{
            res.status(200).send({message: 'Extension del archivo no valida'})
       }
    }else{
        res.status(200).send({message: 'No ha subido ninguna imagen'})
    }
}


function getImageFile(req, res){
    var imageFile = req.params.imageFile
    var path_file = './uploads/albums/' +imageFile

    fs.exists(path_file, (exists) =>{
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: "No existe la imagen..."});
        }
    })
}

module.exports = {
    getAlbum, saveAlbum, getAll, updateAlbum, deleteAlbum, uploadImage, getImageFile
}