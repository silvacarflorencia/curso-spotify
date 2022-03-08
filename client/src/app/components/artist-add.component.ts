import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params} from '@angular/router'
import {Artist} from '../models/artist'
import {UserService} from '../services/user.service'
import {ArtistService} from '../services/artist.service'
import {GLOBAL} from '../services/global'


@Component({
    selector:'artist-add',
    templateUrl: '../views/artist-add.html',
    providers: [UserService, ArtistService]
})

export class ArtistAddComponent implements OnInit{
    public titulo: string;
    public artist: any;
    public identity;
    public token;
    public url: string;
    public errorMessage: string;
    public is_edit = false;
    public filesToUpload: Array<File>;
    
    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService)
        {
            this.titulo = 'Crear nuevo artista'
            this.identity = this._userService.getIdentity().user;
            this.token = this._userService.getToken();
            this.url = GLOBAL.url
            this.artist = new Artist('','','', '')
            this.errorMessage = ''
            this.is_edit = false
            this.filesToUpload = [];
        }
    ngOnInit(): void {
        console.log('Artista add')
    }

    onSubmit(){
       this._artistService.addArtist(this.token, this.artist).subscribe(
           (res) => {
               
               if(!res){
                   this.errorMessage = 'Error en el servidor'
               }else{
                   this.errorMessage= 'El artista se ha creado correctamente'
                const artist = JSON.stringify(res);
                this.artist = JSON.parse(artist);
                
                this.artist = this.artist.artist

                console.log(this.artist._id)

                this._router.navigate(['/editar-artista/'+ this.artist._id])
                this.is_edit = true
               }
           },
           (err) => {
            this.errorMessage = err.error.message
           }
       )
    }

    fileChangeEvent(fileInput: any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }
}