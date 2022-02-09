'use strict'

var mongoose = require('mongoose');
var app = require('./app');

var port = process.env.PORT || 3977; //puerto por defecto del backend

//mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/curso', (err, res) => {
    if(err){
        throw err;
    }else{
        console.log("Se conecto bien");
        app.listen(port, function(){
            console.log("Escuhando en: " + port)
        });
    }
});