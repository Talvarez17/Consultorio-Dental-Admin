import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { PacientesComponent } from './pages/auth/pacientes/pacientes.component';
import { CitasComponent } from './pages/auth/citas/citas.component';
import { ConsultasComponent } from './pages/auth/consultas/consultas.component';
import { NavbarComponent } from './pages/navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PacientesComponent,
    CitasComponent,
    ConsultasComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
