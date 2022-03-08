import { Component, OnInit } from "@angular/core";
import { Song} from '../models/song'
import {GLOBAL} from '../services/global'

@Component({
    selector:'player',
    template: `
    <div class="album-image">
        <span *ngIf="song.album">
         <!--   <img src="{{url + 'get-image-album/' + song.album.image}}" id="play-image-album"/>-->
        </span>
        <span *ngIf="song.album">
            <img src="assets/images/default.jpg" id="play-image-album"/>
        </span>
    </div>
    <div class="audio-file">
        <p>Reproduciendo</p>
        <span class="play-song-title">
            {{song.name}}
        </span>
        |
        <span class="play-song-artist">
           <!-- <span *ngIf="song.album.artist"></span>
            {{song.album}} -->
        </span>
        <audio controls id = "player">
            <source id="mp3-source" src="{{url + 'get-song-file/' + song.file}}" type="audio/mpeg"/>
            Tu navegador no es compatible
        </audio>
    </div>` 
})

export class PlayerComponent implements OnInit{
    public url:string
    public song: Song
    constructor(){
        this.url = GLOBAL.url
        this.song = new Song(1,'','','', '','')
    }
    ngOnInit(): void {
        console.log('player')
    }
}