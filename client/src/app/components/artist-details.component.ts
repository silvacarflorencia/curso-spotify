import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params} from '@angular/router'
import {Artist} from '../models/artist'
import {UserService} from '../services/user.service'
import {ArtistService} from '../services/artist.service'
import {GLOBAL} from '../services/global'


@Component({
    selector:'artist-details',
    templateUrl: '../views/artist-details.html',
    providers: [UserService, ArtistService]
})

export class ArtistDetailsComponent implements OnInit{
    
    public identity;
    public token;
    public url: string;
    public errorMessage: string;
    public artist: Artist
    
    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService)
        {
            this.artist = new Artist('','','','')
            this.identity = this._userService.getIdentity().user;
            this.token = this._userService.getToken();
            this.url = GLOBAL.url
            this.errorMessage = ''
           
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
    
                            //sacar albums de artista
    
                        }else{
                            this._router.navigate(['/'])
                        }
                    },
                (err) => {
                    console.log(err)
                }
                )
            })
        }
    

  
}