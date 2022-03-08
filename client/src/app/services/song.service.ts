//metodos que interactuan con la api en relacion a usuarios
import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { GLOBAL } from './global'
import { Song } from '../models/song';

@Injectable()
export class SongService {
    public url: string;
    //se inyecta el HttpClient por aca para poder hacer uso de todos sus metodos
    constructor(private _http: HttpClient) {
        this.url = GLOBAL.url
    }

    addSong(token: string, song: Song) {
        let params = JSON.stringify(song);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        })

        return this._http.post(this.url + 'song-save', params, { headers: headers })
    }

    editSong(token: string, id: string, song: Song) {
        let params = JSON.stringify(song);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        })

        return this._http.put(this.url + 'song-update/' + id, params, { headers: headers })
    }
    /*
        editArtist(token: string, id: string, artist:Artist){
            let params = JSON.stringify(artist);
            let headers = new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': token
            })
    
            return this._http.put(this.url+'artist-update/'+id, params, {headers: headers})
        }
    */
    getSong(token: string, id: string) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        })

        /*let options = new RequestOptions({
            headers: headers
        })*/

        return this._http.get(this.url + 'song/' + id, { headers: headers })

    }

    getSongs(token: string, albumId: string) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        })

        /*let options = new RequestOptions({
            headers: headers
        })*/
if(albumId == ''){
    return this._http.get(this.url+'song/', {headers:headers})
}else{
    return this._http.get(this.url+'songs/'+albumId, {headers:headers})
}

        

    }

    deleteSong(token:string, id: string){
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        })

        /*let options = new RequestOptions({
            headers: headers
        })*/

        return this._http.delete(this.url+'song/'+id, {headers:headers})
 
     }
    }
