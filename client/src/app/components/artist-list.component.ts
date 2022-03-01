import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params} from '@angular/router'
import {Artist} from '../models/artist'
import {UserService} from '../services/user.service'
import {ArtistService} from '../services/artist.service'
import {GLOBAL} from '../services/global'

@Component({
    selector:'artist-list',
    templateUrl: '../views/artist-list.html',
    providers: [UserService, ArtistService]
})

export class ArtistListComponent implements OnInit{
    public titulo: string;
    public artists: Artist[];
    public identity;
    public token;
    public url: string 
    public next_page;
    public prev_page;
    public confirmado: string | null

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService)
        {
            this.titulo = 'Artistas'
            this.identity = this._userService.getIdentity().user;
            this.token = this._userService.getToken();
            this.url = GLOBAL.url
            this.artists = [];
            this.prev_page = 1
            this.next_page = 1
            this.confirmado = null
        }
    ngOnInit(): void {
        this.getArtis()
    }

    getArtis(){
        this._route.params.forEach((params: Params) =>{
            let page = +params['page'];
            if(!page){
                page =1
            }else{
                this.next_page = page +1;
                this.prev_page = page -1
                
                if(this.prev_page == 0){
                    this.prev_page = 1
                }
            }

            this._artistService.getArtists(this.token, page).subscribe(
                (res) => {
                    if(!res){
                        this._router.navigate(['/'])
                    }else{
                        this.artists = JSON.parse(JSON.stringify(res)).artists
                        console.log(this.artists)
                    }
                }, 
                (err) =>{
                    console.log(err)
                }
            )
        })
    }
    onDeleteConfirm(id: string){
        this.confirmado = id
    }

    onCancelArtist(){
        this.confirmado = null;
    }

    onDeleteArtist(id: string){
        console.log(id)
        this._artistService.deleteArtist(this.token, id).subscribe(
            (res) =>{
                if(!res){
                    alert("Error en el servidor")
                }else{
                    this.getArtis()
                }
            },
            (err) => {
                console.log(err)
            }

        )
    }
}