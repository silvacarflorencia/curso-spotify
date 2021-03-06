import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from "@angular/router"
import { User } from './models/user';
import {UserService} from './services/user.service'
 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})
export class AppComponent implements OnInit {
  public title = 'MUSIFY';
  public user: User;
  public user_register: User;
  public identity_register: any;
  public identity: any;
  public token: string | null;
  public errorMessage: any;
  public errorMessageRegister: any;
  public alertRegister: string;
  public url: string

  //inyecto la clase servicios para usar sus metodos
  constructor(
    private _userService:UserService, 
    private _route:ActivatedRoute,
    private _router: Router){
    this.user = new User('','','','','','ROLE_USER','','');
    this.user_register = new User('','','','','','ROLE_ADMIN','','');
    this.identity = ''
    this.identity_register = ''
    this.token = ''
    this.alertRegister = ''
    this.url = this._userService.url
  }

  //se ejecuta al cargar el componente
  ngOnInit() {

    this.identity = this._userService.getIdentity()
    this.token = this._userService.getToken()
  
  }

  public onSubmit(){
   
    this._userService.singUp(this.user, null).subscribe(
      (res) => {
        const user = JSON.stringify(res);
        this.identity = JSON.parse(user).user;

        console.log(this.identity)
        if(this.user._id){
          alert("El usuario no esta correctamente identificado")
        }else{
          //Crear el elemento en el localstorage
          localStorage.setItem('identity', user);

          //Conseguir el token para enviarselo a cada peticion http
          this._userService.singUp(this.user, 'true').subscribe(
            (res) => {
              const token = JSON.stringify(res);
              this.token = token
      
              if(this.token.length <= 0){
                alert("El token no se ha generado")
              }else{
                localStorage.setItem('token', this.token); 
                this.user = new User('','','','','','ROLE_USER','','');            
              }
            },
            (err) => {this.errorMessage = err.error.message}
          )}
        console.log("Respuesta" + JSON.stringify(res))
      },
      (err) => {this.errorMessage = err.error.message}
    )}

    logout(){
      localStorage.removeItem('identity');
      localStorage.removeItem('token');

      localStorage.clear();

      this.identity = null;
      this.token = null;
      this._router.navigate(['/'])
    }

    onSubmitRegister(){
    this._userService.register(this.user_register).subscribe(
      (res) => {
        const user = JSON.stringify(res);
        this.identity_register = JSON.parse(user);
        
        if(!this.identity_register.user._id){
          this.alertRegister = 'Error al registrarse';
        }else{
          this.alertRegister = 'El registro se ha realizado correctamente, identificate con ' + this.user_register.email
          this.user_register = new User('','','','','','ROLE_ADMIN','','');
        }
      },
      (err) => {this.errorMessageRegister = err.error.message}
    )
      
  }
}
