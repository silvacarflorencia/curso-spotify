import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http'; 
import {HomeComponent} from './components/home.component'
import { UserEditComponent } from './components/user-edit.component';
import { ArtistListComponent } from './components/artist-list.component';
import { ArtistAddComponent } from './components/artist-add.component';
import {routing, appRoutingProviders} from './app.routing'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserEditComponent,
    ArtistListComponent,
    ArtistAddComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule, 
    FormsModule,
    HttpClientModule, 
    routing
  ],
  //puedo poner servicios para que se vean desde toda la app
  providers: [appRoutingProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
