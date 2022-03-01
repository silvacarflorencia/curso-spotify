import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params} from '@angular/router'
import {Artist} from '../models/artist'
import {UserService} from '../services/user.service'
import {ArtistService} from '../services/artist.service'
import {UploadService} from '../services/upload.service'
import {GLOBAL} from '../services/global'


@Component({
    selector:'artist-edit',
    templateUrl: '../views/artist-add.html',
    providers: [UserService, ArtistService, UploadService]
})

export class ArtistEditComponent implements OnInit{
    public titulo: string;
    public artist: any;
    public identity;
    public token;
    public url: string;
    public errorMessage: string;
    public is_edit = true
    public filesToUpload: Array<File>;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _uploadService: UploadService)
        {
            this.titulo = 'Editar nuevo artista'
            this.identity = this._userService.getIdentity().user;
            this.token = this._userService.getToken();
            this.url = GLOBAL.url
            this.artist = new Artist('','','','')
            this.errorMessage = ''
            this.is_edit = true
            this.filesToUpload = [];
        }
    ngOnInit(): void {
        //Lamar a l metodo de la api para sacar un artista en vase a su id getArtist
    this.getArtist();
    }

    getArtist(){
        this._route.params.forEach((params:Params) =>{
            let id= params['id'];

            this._artistService.getArtist(this.token, id).subscribe(
                (res) => {
                    if(res){
                        this.artist = JSON.parse(JSON.stringify(res)).artist

                        console.log(this.artist)

                    }else{
                        this._router.navigate(['/'])
                    }
                },
            (err) => {

            }
            )
        })
    }

    onSubmit(){
        this._route.params.forEach((params:Params) =>{let id= params['id'];
    
        this._artistService.editArtist(this.token, id, this.artist).subscribe(
            (res) => {
                
                if(!res){
                    this.errorMessage = 'Error en el servidor'
                }else{
                 console.log(res)
                 this.errorMessage= 'El artista se haactualizado correctamente'
                 const artist = JSON.stringify(res);
                 this.artist = JSON.parse(artist);
                 

                 //Subir imagen de artista
                 this._uploadService.makeFileRequest(this.url+'upload-image-artist/'+id, [], this.filesToUpload, this.token, 'image')
                    .then(
                        result => {
                            console.log(result)
                            this._router.navigate(['/artistas', 1])
                        },
                        err => {console.log(err)}
                    )  
                 //this.artist = this.artist.artist
                 //this._router.navigate(['/editar-artista'], this.artist._id)
                }
            },
            (err) => {
             this.errorMessage = err.error.message
            }
        )
    
    })
    }

    fileChangeEvent(fileInput:any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }


   
}