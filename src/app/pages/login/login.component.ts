import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConexionService } from 'src/app/services/conexion.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  Login: FormGroup = this.fb.group({
    correo: [, Validators.required],
    contrasenia: [, Validators.required],
  });

  constructor(public router: Router, private fb: FormBuilder, public service: ConexionService) {
    localStorage.clear();
  }

  ngOnInit() { }

  login() {

    this.service.post('doctor/login', this.Login.value).subscribe((info: any) => {

      if (info.error == false) {
        localStorage.setItem("id", info.data);
        this.router.navigate(['/pacientes']);
      }
      else {
        Swal.fire({
          icon: "error",
          title: "Correo o contraseña incorrectos",
          text: "Verifique que esten escritos correctamente",
          showConfirmButton: false,
          timer: 1500
        });
      };
    });

  }

  campoValido(campo: string) {
    return this.Login.controls[campo].errors && this.Login.controls[campo].touched;
  };


}
