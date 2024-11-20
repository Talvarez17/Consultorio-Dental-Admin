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
  page = 1;
  total = 0;
  perPage = 3;
  currentSearch: string = '';
  update = false;


  // --------------------------------------------- Formularios -------------------------------------------------------------------
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
    id: [],
    nombre: [, [Validators.required, Validators.maxLength(50), Validators.minLength(2)]],
    apellidoPaterno: [, [Validators.required, Validators.maxLength(50), Validators.minLength(2)]],
    apellidoMaterno: [, [Validators.required, Validators.maxLength(50), Validators.minLength(2)]],
    fechaNacimiento: [, Validators.required],
    telefono: [, [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern(/^\d{10}$/)]],
    correo: [, [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]]
  });

  FormularioCita: FormGroup = this.fb.group({
    id: this.uudi,
    idPaciente: [],
    nombrePaciente: [],
    apellidoPaternoPaciente: [],
    apellidoMaternoPaciente: [],
    motivo: [, [Validators.required, Validators.maxLength(50), Validators.minLength(2)]],
    fecha: [, Validators.required],
    hora: [, Validators.required]
  });


  constructor(public router: Router, private fb: FormBuilder, public service: ConexionService) {
  }

  ngOnInit() { this.obtenerPacientes() }

  //-------------------------------------------- Calculo de la edad del paciente --------------------------------------
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

  //-------------------------------------------- Manejo de los modales editar y cita --------------------------------------

  @ViewChild('editarPaciente') editarPaciente!: ElementRef;

  abrirModalYObtenerPaciente(id: any) {
    this.update = true;
    this.obtenerUnPaciente(id);
    setTimeout(() => {
      this.editarPaciente.nativeElement.showModal();
      this.update = false;
    }, 500);
  }

  @ViewChild('agregarCita') agregarCita!: ElementRef;

  abrirModalCita(id: any, nombre: string, apellidoPaterno: string, apellidoMaterno: string) {
    this.agregarCita.nativeElement.showModal();

    this.FormularioCita.patchValue({
      idPaciente: id,
      nombrePaciente: nombre,
      apellidoPaternoPaciente: apellidoPaterno,
      apellidoMaternoPaciente: apellidoMaterno,
    });
  }

  //-------------------------------------------- Metodos --------------------------------------

  obtenerPacientes(page: number = 1, search: string = ''): void {
    const queryParams = `page=${page}&pageSize=${this.perPage}&search=${search}`;
    this.service.get(`paciente/getAll?${queryParams}`).subscribe((info: any) => {
      if (info) {
        this.pacientes = info.data; 
        this.total = info.pagination.total; 
        this.page = info.pagination.currentPage;
      }
    });
  }
  

  onPageChange(page: number): void {
    this.obtenerPacientes(page, this.currentSearch);
  }
  
  onSearch(event: Event): void {
    const search = (event.target as HTMLInputElement).value;
    this.currentSearch = search;
    this.obtenerPacientes(1, search);
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
          correo: info.data.correo
        });

        this.pacienteSolo = info.data.id;
      }
    })
  }

  actualizarPaciente(id: any) {

    this.service.put(`paciente/update/${id}`, this.FormularioE.value).subscribe((info: any) => {

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

  crearCita() {
    this.service.post('citas/insert', this.FormularioCita.value).subscribe((info: any) => {

      if (info.error == false) {
        console.log(info.data);

        Swal.fire({
          icon: "success",
          title: "Exito",
          text: "Registro creado con exito",
          showConfirmButton: false,
          timer: 1500
        });
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

  //-------------------------------------------- Valdacion de campos --------------------------------------

  campoValidoAgregar(campo: string) {
    return this.FormularioA.controls[campo].errors && this.FormularioA.controls[campo].touched;
  };

  campoValidoEditar(campo: string) {
    return this.FormularioE.controls[campo].errors && this.FormularioE.controls[campo].touched;
  };

  campoValidoCita(campo: string) {
    return this.FormularioCita.controls[campo].errors && this.FormularioCita.controls[campo].touched;
  };

}
