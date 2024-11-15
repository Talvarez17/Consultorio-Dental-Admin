import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConexionService } from 'src/app/services/conexion.service';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class PacientesComponent {

  uudi = uuidv4();
  pacientes: any = [];
  pacienteSolo: any = [];

  FormularioA: FormGroup = this.fb.group({
    _id: this.uudi,
    nombre: [, [Validators.required, Validators.maxLength(50), Validators.minLength(2)]],
    apellidoPaterno: [, [Validators.required, Validators.maxLength(50), Validators.minLength(2)]],
    apellidoMaterno: [, [Validators.required, Validators.maxLength(50), Validators.minLength(2)]],
    fechaNacimiento: [, Validators.required],
    telefono: [, [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern(/^\d{10}$/)]],
    correo: [, [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
    contrasenia: [, Validators.required]
  });

  FormularioE: FormGroup = this.fb.group({
    id:[],
    nombre: [, [Validators.required, Validators.maxLength(50), Validators.minLength(2)]],
    apellidoPaterno: [, [Validators.required, Validators.maxLength(50), Validators.minLength(2)]],
    apellidoMaterno: [, [Validators.required, Validators.maxLength(50), Validators.minLength(2)]],
    fechaNacimiento: [, Validators.required],
    telefono: [, [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern(/^\d{10}$/)]],
    correo: [, [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
    contrasenia: [, Validators.required]
  });


  constructor(public router: Router, private fb: FormBuilder, public service: ConexionService) {
  }

  ngOnInit() { this.obtenerPacientes() }

  calcularEdad(fechaNacimiento: string): number {
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }

    return edad;
  }

  @ViewChild('editarPaciente') editarPaciente!: ElementRef;

  abrirModalYObtenerPaciente(id: any) {
    this.editarPaciente.nativeElement.showModal();
    this.obtenerUnPaciente(id);
  }

  obtenerPacientes() {
    this.service.get('paciente/getAll').subscribe((info: any) => {

      console.log(info.data)
      if (info) {
        this.pacientes = info.data;
      }
    })
  }

  obtenerUnPaciente(id: any) {
    this.service.get(`paciente/getOne/${id}`).subscribe((info: any) => {

      if (info.error == false) {
        this.FormularioE.patchValue({
          id: info.data.id,
          nombre: info.data.nombre,
          apellidoPaterno: info.data.apellidoPaterno,
          apellidoMaterno: info.data.apellidoMaterno,
          fechaNacimiento: info.data.fechaNacimiento,
          telefono: info.data.telefono,
          correo: info.data.correo,
          contrasenia: null
        });

        this.pacienteSolo = info.data.id;
      }
    })
  }

  actualizarPaciente(id:any) {

    this.service.put(`paciente/update/${id}`, this.FormularioE.value).subscribe((info: any) => {

      console.log(this.FormularioA.value);
      

      if (info.error == false) {

        Swal.fire({
          icon: "success",
          title: "Exito",
          text: "Registro actualizado con exito",
          showConfirmButton: false,
          timer: 1500
        });

        setTimeout(() => {
          location.reload();
        }, 1500);
      }
      else {
        Swal.fire({
          icon: "error",
          title: "Upsss",
          text: "Hubo un error al intentar actualiza el registro, intentelo de nuevo",
          showConfirmButton: false,
          timer: 1500
        });
      };
    });

  }

  agregarPaciente() {

    this.service.post('paciente/insert', this.FormularioA.value).subscribe((info: any) => {

      if (info.error == false) {
        console.log(info.data);

        Swal.fire({
          icon: "success",
          title: "Exito",
          text: "Registro creado con exito",
          showConfirmButton: false,
          timer: 1500
        });

        setTimeout(() => {
          location.reload();
        }, 1500);
      }
      else {
        Swal.fire({
          icon: "error",
          title: "Upsss",
          text: "Hubo un error al intentar crear el registro, intentelo de nuevo",
          showConfirmButton: false,
          timer: 1500
        });
      };
    });

  }

  eliminarPaciente(id: any) {

    Swal.fire({
      title: "¿Quieres eliminar este registro?",
      text: "No podras recuperarlo",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#14B8A6",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {

        this.service.delete(`paciente/delete/${id}`).subscribe((info: any) => {

          if (info.error == false) {
            Swal.fire({
              icon: "success",
              title: "Exito",
              text: "Registro eliminado con exito",
              showConfirmButton: false,
              timer: 1500
            });

            setTimeout(() => {
              location.reload();
            }, 1500);

          } else {
            Swal.fire({
              icon: "error",
              title: "Upsss",
              text: "Hubo un error al intentar eliminar el registro, intentelo de nuevo",
              showConfirmButton: false,
              timer: 1500
            });

          }
        })

      }
    });

  }

  campoValidoAgregar(campo: string) {
    return this.FormularioA.controls[campo].errors && this.FormularioA.controls[campo].touched;
  };

  campoValidoEditar(campo: string) {
    return this.FormularioE.controls[campo].errors && this.FormularioE.controls[campo].touched;
  };

}
