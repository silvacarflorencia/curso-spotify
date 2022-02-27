import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params} from '@angular/router'
import {Artist} from '../models/artist'
import {UserService} from '../services/user.service'
import {GLOBAL} from '../services/global'

@Component({
    selector:'artist-list',
    templateUrl: '../views/artist-list.html',
    providers: [UserService]
})

export class ArtistListComponent implements OnInit{
    public titulo: string;
    public artists: Artist[];
    public identity;
    public token;
    public url: string 

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService)
        {
            this.titulo = 'Artistas'
            this.identity = this._userService.getIdentity().user;
            this.token = this._userService.getToken();
            this.url = GLOBAL.url
            this.artists = [];
        }
    ngOnInit(): void {
        console.log(this.identity)
    }
}