import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { PacientesComponent } from './pages/auth/pacientes/pacientes.component';
import { CitasComponent } from './pages/auth/citas/citas.component';
import { ConsultasComponent } from './pages/auth/consultas/consultas.component';

const routes: Routes = [
  {
    path: "", children: [
      { path: "login", component: LoginComponent },
      { path: "pacientes", component: PacientesComponent },
      { path: "citas", component: CitasComponent },
      { path: "consultas", component: ConsultasComponent },

      { path: "**", redirectTo: "login" },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
