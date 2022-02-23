import { Component, OnInit } from "@angular/core";
import { UserService } from "../services/user.service";
import {User} from '../models/user'
import {GLOBAL} from '../services/global'


@Component({
    selector: 'user-edit',
    templateUrl: '../views/user-edit.html',
    providers:[UserService]
})

export class UserEditComponent implements OnInit{
    public titulo: string;
    public user: any;
    public identity: any;
    public token: any;
    public alertMessage: string
    public url: string
    public filesToUpload: Array<File>;
    

    constructor(private _userService: UserService){
        this.titulo = 'Actulizar mis datos'
        this.alertMessage = ''

        //localStorage
        this.identity = this._userService.getIdentity()
        this.token = this._userService.getToken()
       
        this.user = this.identity.user
        this.url = GLOBAL.url

        this.filesToUpload = [];
        
    }
    ngOnInit(): void {
        console.log('User component cargado')  
    }

    onSubmit(){
        
        this._userService.updateUser(this.user).subscribe(
            (res) => {
                
                const user = JSON.stringify(res);
                this.user = JSON.parse(user);

                this.user = this.user.user
               
                if(!this.user){
                    this.alertMessage = 'El usuario no se ha actualizado'
                }else{

                
                   // this.user = this.user.user
                    localStorage.setItem('identity', JSON.stringify(this.user))

                   const name = window.document.getElementById('identity_name')!
                   name.innerHTML = this.user.surname

                if(!this.filesToUpload){
                    //redireccionar
                }else{
                    console.log(this.user)
                     this.makeFileRequest(this.url+'upload-image-user/'+this.user._id, [], this.filesToUpload).then(
                         (result: any) => {
                            this.user.image = result.image;
                            localStorage.setItem('identity', JSON.stringify(this.user))

                            let image_path = this.url + 'get-image-user/' + this.user.image
                            window.document.getElementById('image-logged')!.setAttribute('src', image_path)
                         }
                     )
                }
                    this.alertMessage = "Datos actulizados correctamente"
                }

                
            },
            (err) => {this.alertMessage = err.error.message}
        )
    }

    fileChangeEvent(fileInput: any){
        this.filesToUpload = <Array<File>>fileInput.target.files;

        console.log(this.filesToUpload)
    }

    makeFileRequest(url:string, params:Array<string>, files: Array<File>){
        var token = this.token;
        return new Promise(function(resolve, reject){
            var formData:any = new FormData();
            var xhr = new XMLHttpRequest();

            for(var i = 0; i < files.length; i++){
                formData.append('image', files[i], files[i].name);
            }

            xhr.onreadystatechange = function(){
                if(xhr.readyState == 4){
                    if(xhr.status == 200){
                        resolve(JSON.parse(xhr.response));
                    }else{
                        reject(xhr.response)
                    }
            }
        }

        xhr.open('POST', url, true);
        xhr.setRequestHeader('Authorization', token);
        xhr.send(formData);
        });
  
        
    }
}