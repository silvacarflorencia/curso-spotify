import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Artist } from '../models/artist'
import { UserService } from '../services/user.service'
import { ArtistService } from '../services/artist.service'
import { AlbumService } from '../services/album.service'
import { GLOBAL } from '../services/global'
import { Album } from "../models/album";

@Component({
    selector: 'artist-details',
    templateUrl: '../views/artist-detail.html',
    providers: [UserService, ArtistService, AlbumService]
})

export class ArtistDetailComponent implements OnInit {

    public identity;
    public token;
    public url: string;
    public errorMessage: string;
    public artist: Artist
    public albums: any
    public confirmado: string | null

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _albumService: AlbumService) {
        this.artist = new Artist('', '', '', '')
        this.albums = null
        this.identity = this._userService.getIdentity().user;
        this.token = this._userService.getToken();
        this.url = GLOBAL.url
        this.errorMessage = ''
        this.confirmado = null

    }
    ngOnInit(): void {
        //Lamar a l metodo de la api para sacar un artista en vase a su id getArtist
        this.getArtists();
    }

    getArtists() {
        this._route.params.forEach((params: Params) => {
            let id = params['id'];

            this._artistService.getArtist(this.token, id).subscribe(
                (res) => {
                    if (res) {
                        this.artist = JSON.parse(JSON.stringify(res)).artist
                        //sacar albums de artista
                        this._albumService.getAlbums(this.token, this.artist._id).subscribe(
                            (res) => {
                                if (res) {
                                    if (!res) {
                                        this.errorMessage = 'Este artista no tiene albums'
                                    } else {
                                        this.albums = JSON.parse(JSON.stringify(res)).albums
                                        console.log(this.albums)
                                    }
                                } else {
                                    this._router.navigate(['/'])
                                }
                            },
                            (err) => {
                                console.log(err)
                            }

                        )

                    } else {
                        this._router.navigate(['/'])
                    }
                },
                (err) => {
                    console.log(err)
                }
            )
        })
    }

    onDeleteConfirm(id: string) {
        this.confirmado = id
    }

    onCancelAlbum() {
        this.confirmado = null;
    }

    onDeleteAlbum(id: string, idArtist: string) {

        this._albumService.deleteAlbum(this.token, id).subscribe(
            (res) => {
                if (!res) {
                    alert("Error en el servidor")
                } else {
                    //this.getArtists()
                    console.log('artista' + idArtist)
                    window.location.reload();
                }
            },
            (err) => {
                console.log(err)
            }

        )
    }
}