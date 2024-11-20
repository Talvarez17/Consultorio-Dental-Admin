import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { PacientesComponent } from './pages/auth/pacientes/pacientes.component';
import { CitasComponent } from './pages/auth/citas/citas.component';
import { ConsultasComponent } from './pages/auth/consultas/consultas.component';
import { AuthGuard } from './pages/auth/guard/auth.guard';
import { ProximasCitasComponent } from './pages/auth/proximas-citas/proximas-citas.component';
import { CitasPacienteComponent } from './pages/auth/citas-paciente/citas-paciente.component';

const routes: Routes = [
  {
    path: "", children: [
      { path: "login", component: LoginComponent },
      { path: "pacientes", component: PacientesComponent, canActivate: [AuthGuard] },
      { path: "citas", component: CitasComponent, canActivate: [AuthGuard] },
      { path: "proximas", component: ProximasCitasComponent, canActivate: [AuthGuard] },
      { path: "citasPaciente/:idPaciente", component: CitasPacienteComponent, canActivate: [AuthGuard] },
      { path: "recetas/:idPaciente", component: ConsultasComponent, canActivate: [AuthGuard] },

      { path: "**", redirectTo: "login" },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
