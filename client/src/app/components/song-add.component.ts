import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Song } from '../models/song'
import { UserService } from '../services/user.service'
import { SongService } from '../services/song.service'
import { GLOBAL } from '../services/global'


@Component({
    selector: 'song-add',
    templateUrl: '../views/song-add.html',
    providers: [UserService, SongService]
})

export class SongAddComponent implements OnInit {
    public titulo: string
    public identity;
    public token;
    public url: string;
    public errorMessage: string;
    public song: Song;
    public is_edit: boolean;
    public filesToUpload: Array<File>;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _songService: SongService,
    ) {
        this.titulo = 'Crear nueva cancion'
        this.identity = this._userService.getIdentity().user;
        this.token = this._userService.getToken();
        this.url = GLOBAL.url
        this.song = new Song(1, '', '', '', '', '')
        this.errorMessage = ''
        this.is_edit = false
        this.filesToUpload = []

    }
    ngOnInit(): void {
        
    }

    onSubmit() {
        this._route.params.forEach((params: Params) => {
            console.log(params)

            let album_id = params['album'];
            this.song.album = album_id

            this._songService.addSong(this.token, this.song).subscribe(
                (res) => {
                    if (!res) {
                        this.errorMessage = 'Error en el servidor'
                    } else {
                        this.errorMessage = 'El artista se ha creado correctamente'
                        const song = JSON.stringify(res);
                        
                        this.song = JSON.parse(song).song;

                        console.log(this.song._id)
                        this._router.navigate(['/editar-tema/'+ this.song._id])
                        this.is_edit = true
                       

                        console.log(this.song)

                    }
                },
                (err) => {
                    this.errorMessage = err.error.message
                }
            )
        })
    }

    filesChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.file
    }
}