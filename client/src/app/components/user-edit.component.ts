import { Component, OnInit } from "@angular/core";
import { UserService } from "../services/user.service";
import {User} from '../models/user'

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

    constructor(private _userService: UserService){
        this.titulo = 'Actulizar mis datos'
        this.alertMessage = ''

        //localStorage
        this.identity = this._userService.getIdentity()
        this.token = this._userService.getToken()
       
        this.user = this.identity

        console.log(this.user )
    }
    ngOnInit(): void {
        console.log('User component cargado')  
    }

    onSubmit(){
        
        this._userService.updateUser(this.user).subscribe(
            (res) => {
                
                const user = JSON.stringify(res);
                this.user = JSON.parse(user);

               
                if(!this.user.user){
                    this.alertMessage = 'El usuario no se ha actualizado'
                }else{
                   // this.user = this.user.user
                    localStorage.setItem('identity', JSON.stringify(this.user.user))

                   const name = window.document.getElementById('identity_name')!
                   name.innerHTML = this.user.user.surname

                    this.alertMessage = "Datos actulizados correctamente"
                }

                
            },
            (err) => {this.alertMessage = err.error.message}
        )
    }
}