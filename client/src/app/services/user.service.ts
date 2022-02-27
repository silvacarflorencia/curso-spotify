//metodos que interactuan con la api en relacion a usuarios

import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders} from "@angular/common/http";
import {GLOBAL} from './global'
import { User } from '../models/user';

@Injectable()
export class UserService{
    public url: string;

    //se inyecta el HttpClient por aca para poder hacer uso de todos sus metodos
    constructor(private _http: HttpClient){
        this.url = GLOBAL.url
    }

    singUp(user_to_login: User, getHash: any){
     
      if(getHash != null){
          user_to_login.getHash = getHash;
      }

      let params = JSON.stringify(user_to_login);

      let headers = new HttpHeaders({'Content-Type': 'application/json'});

      return this._http.post(this.url+'login', params, {headers: headers});
    }

    register(user_to_register: User){
        let params = JSON.stringify(user_to_register)
        
        let headers = new HttpHeaders({'Content-Type': 'application/json'});
        
        return this._http.post(this.url+'register', params, {headers: headers});
    }

    updateUser(user_to_update:any){
        let params = JSON.stringify(user_to_update)
        
        let headers = new HttpHeaders({'Content-Type': 'application/json',
                                        'Authorization': this.getToken()});
        
                                        console.log(user_to_update)

        return this._http.put(this.url+'update-user/'+user_to_update._id, params, {headers: headers});
    }
    getIdentity(){
        //convierto un json a un objecto js
       var identity = JSON.parse(localStorage.getItem('identity') || "")

       if(identity == "undefined"){
             identity = null;
        }
        return identity
    }

    getToken(){
        let token = JSON.parse(localStorage.getItem('token') || "");

       if(token == "undefined"){
           token = null;
        }
        return token.token
    }
}