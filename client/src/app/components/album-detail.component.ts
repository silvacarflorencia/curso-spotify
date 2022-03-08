import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params} from '@angular/router'
import {UserService} from '../services/user.service'
import {SongService} from '../services/song.service'
import {AlbumService} from '../services/album.service'
import {GLOBAL} from '../services/global'
import { Album } from "../models/album";
import { Song } from "../models/song";

@Component({
    selector:'album-detail',
    templateUrl: '../views/album-detail.html',
    providers: [UserService, AlbumService, SongService]
})

export class AlbumDetailComponent implements OnInit{
    
    public identity;
    public token;
    public url: string;
    public errorMessage: string;
    public album: Album
    public confirmado: string | null
    public songs:Song[]
    
    
    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService,
        private _songService: SongService)
        {   
            this.album = new Album('','',1,'','','')
            this.songs = []
            this.identity = this._userService.getIdentity().user;
            this.token = this._userService.getToken();
            this.url = GLOBAL.url
            this.errorMessage = ''
            this.confirmado = null
           
        }
        ngOnInit(): void {
            //Lamar a l metodo de la api para sacar un artista en vase a su id getArtist
        this.getAlbum();
        }
    
        getAlbum(){
           this._route.params.forEach((params:Params) =>{
                let id= params['id'];
                
                this._albumService.getAlbum(this.token, id).subscribe(
                    (res) => {
                        if(res){
                            this.album = JSON.parse(JSON.stringify(res)).album
                            //sacar canciones del album
                            this._songService.getSongs(this.token, this.album._id).subscribe(
                                (res) => {
                                    if(res){
                                        if(!res){
                                            this.errorMessage = 'Este album no tiene canciones'
                                        }else{
                                            this.songs = JSON.parse(JSON.stringify(res)).songs
                                            console.log(this.songs)
                                        }                                        
                                    }else{
                                        this._router.navigate(['/'])
                                    }
                                },
                            (err) => {
                                console.log(err)
                            }
             
                            )
    
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
        
        onDeleteConfirm(id:string){
            console.log(id)
            this.confirmado = id;
        }

        onCancelSong(){
            this.confirmado = null
        }

        onDeleteSong(id:string){
            this._songService.deleteSong(this.token, id).subscribe(
                (res) =>{
                    if(!res){
                        alert("Error en el servidor")
                    }else{
                        this.getAlbum()
                       // console.log('artista' + id)  
                     //   window.location.reload();
                    }
                },
                (err) => {
                    console.log(err)
                }              
            )
        }

        startPlayer(song: Song){
            let songPlayer = JSON.stringify(song)
            let filePath = this.url + 'get-song-file/'+song.file
           // let imagePath = this.url + 'get-image-album/' + song.album.image

            localStorage.setItem('soundSong', songPlayer)
            window.document.getElementById('mp3-source')?.setAttribute('src', filePath);
            (document.getElementById("player") as any).load();
            (document.getElementById("player") as any).play();

           let playSong = window.document.getElementById('play-song-title')!
           playSong.innerHTML = song.name

          //  window.document.getElementById('play-song-artist')!.innerHTML = song.album.artist.name
         // window.document.getElementById('play-image-album')?.setAttribute("src", imagePath);
        }
}