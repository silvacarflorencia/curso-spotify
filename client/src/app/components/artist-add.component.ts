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
    public artist: Artist;
    public identity;
    public token;
    public url: string;
    public errorMessage: string;

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
            this.artist = new Artist('','','')
            this.errorMessage = ''
        }
    ngOnInit(): void {
        console.log('Artista add')
    }

    onSubmit(){
       this._artistService.addArtist(this.token, this.artist).subscribe(
           (res) => {
               const artist = JSON.stringify(res);
               console.log(artist)
           },
           (err) => {
            this.errorMessage = err.error.message
           }
       )
    }
}