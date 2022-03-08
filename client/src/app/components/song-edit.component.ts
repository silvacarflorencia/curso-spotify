import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Song } from '../models/song'
import { UserService } from '../services/user.service'
import { SongService } from '../services/song.service'
import { UploadService } from '../services/upload.service'
import { GLOBAL } from '../services/global'


@Component({
    selector: 'song-edit',
    templateUrl: '../views/song-add.html',
    providers: [UserService, SongService, UploadService]
})

export class SongEditComponent implements OnInit {
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
        private _uploadService: UploadService
    ) {
        this.titulo = 'Editar cancion'
        this.identity = this._userService.getIdentity().user;
        this.token = this._userService.getToken();
        this.url = GLOBAL.url
        this.song = new Song(1, '', '', '', '', '')
        this.errorMessage = ''
        this.is_edit = true
        this.filesToUpload = []

    }
    ngOnInit(): void {
        //Sacar la cancion a editar

        this.getSong()
    }

    getSong(){
        this._route.params.forEach((params:Params) =>{
            let id = params['id'];
            this._songService.getSong(this.token, id).subscribe(
                res => {
                    if(!res){
                        this._router.navigate(['/'])
                    }else{
                        const song = JSON.stringify(res);
                        this.song = JSON.parse(song).song;
                    }
                    
                  

                },
                err => {}
            )
        })
        
    }

    onSubmit() {
        this._route.params.forEach((params: Params) => {
            let idSong = params['id'];

            this._songService.editSong(this.token, idSong, this.song).subscribe(
                (res) => {
                    if (!res) {
                        this.errorMessage = 'Error en el servidor'
                    } else {
                        this.errorMessage = 'La cancion se ha creado correctamente'
                        // const song = JSON.stringify(res);
                        //  this.song = JSON.parse(song).song;

                        if(!this.filesToUpload){
                            this._router.navigate(['/album', this.song.album])
                        }else{
                            //Subir fichero de audio
                        this._uploadService.makeFileRequest(this.url + 'upload-file-song/' + idSong, [], this.filesToUpload, this.token, 'file')
                        .then(
                            result => {
                                console.log(result)
                                this._router.navigate(['/album', this.song.album])
                            },
                            err => { console.log(err) }
                        )
                        }
                        // this._router.navigate(['/editar-song/'+ this.song._id])
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