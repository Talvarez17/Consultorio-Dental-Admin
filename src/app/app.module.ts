import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { PacientesComponent } from './pages/auth/pacientes/pacientes.component';
import { CitasComponent } from './pages/auth/citas/citas.component';
import { ConsultasComponent } from './pages/auth/consultas/consultas.component';
import { NavbarComponent } from './pages/navbar/navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {NgxPaginationModule} from 'ngx-pagination';
import { ProximasCitasComponent } from './pages/auth/proximas-citas/proximas-citas.component';
import { CitasPacienteComponent } from './pages/auth/citas-paciente/citas-paciente.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PacientesComponent,
    CitasComponent,
    ConsultasComponent,
    NavbarComponent,
    ProximasCitasComponent,
    CitasPacienteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
