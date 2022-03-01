import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Album } from '../models/album'
import { Artist } from '../models/artist'
import { UserService } from '../services/user.service'
import { UploadService } from '../services/upload.service'
import { AlbumService } from '../services/album.service'
import { GLOBAL } from '../services/global'



@Component({
    selector: 'album-edit',
    templateUrl: '../views/album-add.html',
    providers: [UserService, AlbumService, UploadService]
})

export class AlbumEditComponent implements OnInit {
    public titulo: string
    public album: Album;
    public artist: Artist;
    public identity;
    public token;
    public url: string;
    public errorMessage: string;
    public is_edit: boolean;
    public filesToUpload: Array<File>;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService,
        private _uploadService: UploadService
    ) {
        this.titulo = 'Editar album'
        this.identity = this._userService.getIdentity().user;
        this.token = this._userService.getToken();
        this.url = GLOBAL.url
        this.album = new Album('', '', 2017, '', '', '')
        this.artist = new Artist('', '', '', '')
        this.errorMessage = ''
        this.is_edit = true,
        this.filesToUpload = []

    }
    ngOnInit(): void {
        this.getAlbum()
    }

    getAlbum() {
        this._route.params.forEach((params: Params) => {
            let id = params['album']

            this._albumService.getAlbum(this.token, id).subscribe(
                (res) => {
                    if (!res) {
                        this._router.navigate(['/'])
                    } else {
                        this.errorMessage = 'El artista se ha creado correctamente'

                        const album = JSON.stringify(res);
                        this.album = JSON.parse(album).album;

                        console.log(this.album)
                        //this._router.navigate(['/editar-album/'+ this.album._id])

                    }
                },
                (err) => {
                    console.log(err)
                }
            )
        })
    }
    onSubmit() {
        this._route.params.forEach((params: Params) => {
            let id = params['album'];
            console.log(this.album)
            this._albumService.editAlbum(this.token, id, this.album).subscribe(
               
                (res) => {

                    if (!res) {
                        this.errorMessage = 'Error en el servidor'
                    } else {
                        this.errorMessage = 'El album se ha creado correctamente'
                        const album = JSON.stringify(res);
                        this.album = JSON.parse(album).album;

                        console.log(this.filesToUpload)

                        if (!this.filesToUpload) {
                            console.log('fdsfnkdjnf')
                        } else {
                            //Subir la imagen
                            this._uploadService.makeFileRequest(this.url + 'upload-image-album/' + id, [], this.filesToUpload, this.token, 'image')
                                .then(
                                    result => {
                                         const artist = JSON.stringify(result);
                                         this.artist = JSON.parse(artist);
                                         console.log(this.artist)
                                       
                                         this._router.navigate(['/artista', this.album.artist])
                                    },
                                    err => { console.log(err) }
                                )
                            //this._router.navigate(['/editar-artista'], this.artist._id)
                        }
                    }
                },
                (err) => {
                    this.errorMessage = err.error.message
                }
            )
        })
    }

    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }
}