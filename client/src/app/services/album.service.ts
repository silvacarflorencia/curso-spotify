//metodos que interactuan con la api en relacion a usuarios
import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders} from "@angular/common/http";
import {GLOBAL} from './global'
import { Album } from '../models/album';

@Injectable()
export class AlbumService{
    public url: string;
    //se inyecta el HttpClient por aca para poder hacer uso de todos sus metodos
    constructor(private _http: HttpClient){
        this.url = GLOBAL.url
    }

    addAlbum(token: string, album:Album){
        let params = JSON.stringify(album);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        })

        return this._http.post(this.url+'album-save', params, {headers: headers})
    }

    getAlbum(token:string, id:string){
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
    })

    return this._http.get(this.url+'album/'+id, {headers:headers})
    }

    editAlbum(token:string, id: string, album:Album){
        let params = JSON.stringify(album)
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
    })

    return this._http.put(this.url+'album-update/'+id, params, {headers:headers})
    }
}    