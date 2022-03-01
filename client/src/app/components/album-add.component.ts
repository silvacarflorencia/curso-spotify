import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params} from '@angular/router'
import {Artist} from '../models/artist'
import {Album} from '../models/album'
import {UserService} from '../services/user.service'
import {ArtistService} from '../services/artist.service'
import {AlbumService} from '../services/album.service'
import {GLOBAL} from '../services/global'



@Component({
    selector:'album-add',
    templateUrl: '../views/album-add.html',
    providers: [UserService, ArtistService, AlbumService]
})

export class AlbumAddComponent implements OnInit{
    public titulo: string
    public artist: Artist;
    public album: Album;
    public identity;
    public token;
    public url: string;
    public errorMessage: string;
    public is_edit: boolean;
    public filesToUpload: Array<File>;
    
    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService)
        {
            this.titulo = 'Crear nuevo Album'
            this.identity = this._userService.getIdentity().user;
            this.token = this._userService.getToken();
            this.url = GLOBAL.url
            this.artist = new Artist('','','', '')
            this.album = new Album('','', 2017, '', '', '')
            this.errorMessage = ''
            this.is_edit = false,
            this.filesToUpload = []
            
        }
    ngOnInit(): void {
      console.log('fff')
    }

    onSubmit(){
        this._route.params.forEach((params:Params) =>{
            let artist_id = params['artist']; 
            this.album.artist = artist_id

            this._albumService.addAlbum(this.token, this.album).subscribe(
                (res) => {
               
                    if(!res){
                        this.errorMessage = 'Error en el servidor'
                    }else{
                        this.errorMessage= 'El artista se ha creado correctamente'
                     const album = JSON.stringify(res);
                     this.album = JSON.parse(album).album;
                    
                     this._router.navigate(['/editar-album/'+ this.album._id])
                     
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