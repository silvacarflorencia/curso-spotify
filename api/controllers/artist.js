'use strict'
//models
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

//cargar ficheros
var fs = require('fs');
var path = require('path');

//paginacion
var mongoosePaginate = require('mongoose-pagination');

function getArtist(req, res){
    var artistId = req.params.id;

    Artist.findById(artistId, (err, artist) => {
        if(err){
            res.status(500).send({message: 'Error en la peticion'})
        }else{
            if(artist){
                res.status(200).send({artist: artist})
            }else{
                res.status(404).send({message: 'El artista no existe'})
            }
        }
    })
}
function saveArtist(req, res){
    var artist = new Artist();
    var params = req.body;

    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save((err, artistStored) => {
        if(err){
            res.status(500).send({message: 'Error al guardaar'})
        }else{
            if(!artistStored){
                res.status(404).send({message: 'El artista no ha sido guardado'})
            }else{
                res.status(200).send({artist: artistStored})
            }
        }
    })
}

function getAll(req, res){
    var page = 1;
    if(req.params.page){
       page  = req.params.page
    };

    var itemsPerPage = 4;

    Artist.find().sort('name').paginate(page, itemsPerPage, (err, artists, totalItems) =>{
        if(err){
            res.status(500).send({message: "Error en la peticion"})
        }else{
            if(!artists){
                res.status(404).send({message: "No hya artistas"})
            }else{
               return res.status(200).send({
                   totalItems: totalItems,
                   artists: artists
               })
            }
        }
    })
}

function updateArtist(req, res){
    var update = req.body;
    var artistId = req.params.id;

    console.log(artistId)

    Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
        if(err){
            res.status(500).send({message: "Error en la peticion"})
        }else{
            if(!artistUpdated){
                res.status(404).send({message: "No se encontro el artista"}) 
            }else{
                res.status(200).send({artist: artistUpdated})   
            }
        }
    })

}

function deleteArtist(req, res){
    var artistId = req.params.id

    Artist.findByIdAndRemove(artistId, (err, artistRemoved) =>{
        if(err){
            res.status(500).send({message: "Error al eliminar el artista"})
        }else{
            if(!artistRemoved){
                res.status(404).send({message: "El artista no ha sido eliminado"}) 
            }else{
               
                //busca que en el campo artist tengan ese id
                Album.find({artist: artistRemoved._id}).deleteOne((err, albumRemoved) =>{
                    if(err){
                        res.status(500).send({message: "Error al eliminar el album"})
                    }else{
                        if(!artistRemoved){
                            res.status(404).send({message: "El album no ha sido eliminado"}) 
                        }else{
                        
                     //busca que en el campo song tengan ese id
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
                        }
                    } 
                })
            }
        }
    })
}

function uploadImage(req, res){
    var artistId = req.params.id;
    var file_name = 'No subido...';

    if(req.files){
       var file_path = req.files.image.path;
       var file_split = file_path.split('\\');
       var file_name = file_split[2];

       var ext_split = file_name.split('.');
       var file_ext = ext_split[1];

       if(file_ext == 'png' || file_ext == 'jpeg' || file_ext == 'jpg' || file_ext == 'gif'){
            Artist.findByIdAndUpdate(artistId, {image: file_name}, (err, artistUpdated) =>{
                if(!artistUpdated){
                    res.status(404). send({message : 'No se ha registrado el usuario'}) 
                }else{
                    res.status(200). send({artist : artistUpdated}) ;
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
    var path_file = './uploads/artists/' +imageFile

    fs.exists(path_file, (exists) =>{
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: "No existe la imagen..."});
        }
    })
}

module.exports = {
    getArtist, saveArtist, getAll, updateArtist, deleteArtist, uploadImage, getImageFile
}