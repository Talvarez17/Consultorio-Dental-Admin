import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConexionService } from 'src/app/services/conexion.service';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-citas-paciente',
  templateUrl: './citas-paciente.component.html',
  styleUrls: ['./citas-paciente.component.css']
})
export class CitasPacienteComponent {
  uudi = uuidv4();
  date = new Date();
  citas: any = [];
  citaSola: any = [];
  page = 1;
  total = 0;
  perPage = 3;
  currentSearch: string = '';
  update = false;
  paciente = '';


  horaActual() {
    const hora = this.date.getHours().toString().padStart(2, '0');
    const minutos = this.date.getMinutes().toString().padStart(2, '0');
    const tiempo = `${hora}:${minutos}`;

    return tiempo;
  }


  // --------------------------------------------- Formularios -------------------------------------------------------------------
  FormularioA: FormGroup = this.fb.group({
    id: this.uudi,
    idPaciente: [],
    idCita: [],
    nombrePaciente: [],
    apellidoPaternoPaciente: [],
    apellidoMaternoPaciente: [],
    fecha: this.date.toISOString().split('T')[0],
    hora: this.horaActual(),
    prescripcion: [, [Validators.required, Validators.minLength(2)]],
    recomendaciones: [, [Validators.required, Validators.minLength(2)]],
  });

  FormularioE: FormGroup = this.fb.group({
    id: [],
    idPaciente: [],
    nombrePaciente: [],
    apellidoPaternoPaciente: [],
    apellidoMaternoPaciente: [],
    motivo: [, [Validators.required, Validators.maxLength(50), Validators.minLength(2)]],
    fecha: [, Validators.required],
    hora: [, Validators.required],
    estado: [, Validators.required]
  });

  constructor(public router: Router, private fb: FormBuilder, public service: ConexionService, private activeRoute: ActivatedRoute) {
  }

  ngOnInit() { 
    const idPaciente = this.activeRoute.snapshot.params['idPaciente'];
    this.paciente = idPaciente;
    this.obtenerCitasPaciente(idPaciente) }

  //-------------------------------------------- Formato de la hora y esatus --------------------------------------
  formatoHora(hora: string): string {
    const [horas, minutos] = hora.split(':');
    const fecha = new Date();
    fecha.setHours(+horas, +minutos);
    return fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  estatusCita(estado: any) {
    switch (estado) {
      case 0:
        return "Cancelada";
      case 1:
        return "Activa";
      case 2:
        return "Completada";
      default:
        return "Activa";
    }
  }


  //-------------------------------------------- Manejo de los modales editar y cita --------------------------------------

  @ViewChild('editarCita') editarCita!: ElementRef;

  abrirModalEditar(id: any) {
    this.update = true;
    this.obtenerUnaCita(id);
    setTimeout(() => {
      this.editarCita.nativeElement.showModal();
      this.update = false;
    }, 500);
  }

  @ViewChild('agregarReceta') agregarReceta!: ElementRef;

  abrirModalReceta(idP: any, idC: any, nombre: string, apellidoPaterno: string, apellidoMaterno: string) {
    this.agregarReceta.nativeElement.showModal();

    this.FormularioA.patchValue({
      idPaciente: idP,
      idCita: idC,
      nombrePaciente: nombre,
      apellidoPaternoPaciente: apellidoPaterno,
      apellidoMaternoPaciente: apellidoMaterno
    });
  }

  //-------------------------------------------- Metodos --------------------------------------

  marcarCompletada(idP: any, idC: any, nombre: string, apellidoPaterno: string, apellidoMaterno: string, motivo: string, fecha: any, hora: any) {
    this.FormularioE.patchValue({
      id: idC,
      idPaciente: idP,
      nombrePaciente: nombre,
      apellidoPaternoPaciente: apellidoPaterno,
      apellidoMaternoPaciente: apellidoMaterno,
      motivo: motivo,
      fecha: fecha,
      hora: hora,
      estado: 2
    });

    Swal.fire({
      title: "¿Quieres marcar como completada esta cita?",
      text: "Se cambiara su estado",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#14B8A6",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {

        this.service.put(`citas/update/${idC}`, this.FormularioE.value).subscribe((info: any) => {

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

          } else {
            Swal.fire({
              icon: "error",
              title: "Upsss",
              text: "Hubo un error al intentar actualizar el registro, intentelo de nuevo",
              showConfirmButton: false,
              timer: 1500
            });

          }
        })

      }
    });

  }

  obtenerCitasPaciente(id:any ='', page: number = 1, search: string = ''): void {
    const queryParams = `id=${id}&page=${page}&pageSize=${this.perPage}&search=${search}`;
    this.service.get(`citas/getAllCitas?${queryParams}`).subscribe((info: any) => {
      if (info) {
        this.citas = info.data;
        this.total = info.pagination.total;
        this.page = info.pagination.currentPage;
      }
    });
  }

  onPageChange(page: number): void {
    this.obtenerCitasPaciente(this.paciente,page, this.currentSearch);
  }

  onSearch(event: Event): void {
    const search = (event.target as HTMLInputElement).value;
    this.currentSearch = search;
    this.obtenerCitasPaciente(this.paciente,1, search);
  }

  obtenerUnaCita(id: any) {
    this.service.get(`citas/getOne/${id}`).subscribe((info: any) => {

      if (info.error == false) {
        this.FormularioE.patchValue({
          id: info.data.id,
          idPaciente: info.data.idPaciente,
          nombrePaciente: info.data.nombrePaciente,
          apellidoPaternoPaciente: info.data.apellidoPaternoPaciente,
          apellidoMaternoPaciente: info.data.apellidoMaternoPaciente,
          motivo: info.data.motivo,
          fecha: info.data.fecha,
          hora: info.data.hora,
          estado: info.data.estado
        });

        this.citaSola = info.data.id;
      }
    })
  }

  actualizarCita(id: any) {

    this.service.put(`citas/update/${id}`, this.FormularioE.value).subscribe((info: any) => {

      console.log(this.FormularioE.value);

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

  agregarConsulta() {

    this.service.post('consulta/insert', this.FormularioA.value).subscribe((info: any) => {

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

  eliminarCita(id: any) {

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

        this.service.delete(`citas/delete/${id}`).subscribe((info: any) => {

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


  //-------------------------------------------- Valdacion de campos --------------------------------------

  campoValidoAgregar(campo: string) {
    return this.FormularioA.controls[campo].errors && this.FormularioA.controls[campo].touched;
  };

  campoValidoEditar(campo: string) {
    return this.FormularioE.controls[campo].errors && this.FormularioE.controls[campo].touched;
  };

}
