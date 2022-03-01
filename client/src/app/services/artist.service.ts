//metodos que interactuan con la api en relacion a usuarios
import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders} from "@angular/common/http";
import {GLOBAL} from './global'
import { Artist } from '../models/artist';

@Injectable()
export class ArtistService{
    public url: string;
    //se inyecta el HttpClient por aca para poder hacer uso de todos sus metodos
    constructor(private _http: HttpClient){
        this.url = GLOBAL.url
    }

    addArtist(token: string, artist:Artist){
        let params = JSON.stringify(artist);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        })

        return this._http.post(this.url+'artist-save', params, {headers: headers})
    }

    editArtist(token: string, id: string, artist:Artist){
        let params = JSON.stringify(artist);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        })

        return this._http.put(this.url+'artist-update/'+id, params, {headers: headers})
    }

    getArtists(token:string, page: number){
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        })

        /*let options = new RequestOptions({
            headers: headers
        })*/

        return this._http.get(this.url+'artists/'+page, {headers: headers})

    }

    getArtist(token:string, id: string){
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        })

        /*let options = new RequestOptions({
            headers: headers
        })*/
        
        return this._http.get(this.url+'artist/'+id, {headers:headers})

    }

    deleteArtist(token:string, id: string){
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        })

        /*let options = new RequestOptions({
            headers: headers
        })*/

        return this._http.delete(this.url+'artist-delete/'+id, {headers:headers})

    }
}    