import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConexionService } from 'src/app/services/conexion.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-consultas',
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.css']
})
export class ConsultasComponent {

  recetas: any = [];
  recetaSola: any = [];

  // --------------------------------------------- Formularios -------------------------------------------------------------------

  FormularioE: FormGroup = this.fb.group({
    id: [],
    idPaciente: [],
    idCita: [],
    nombrePaciente: [],
    apellidoPaternoPaciente: [],
    apellidoMaternoPaciente: [],
    fecha: [, Validators.required],
    hora: [, Validators.required],
    prescripcion: [, [Validators.required, Validators.minLength(2)]],
    recomendaciones: [, [Validators.required, Validators.minLength(2)]],
  });

  constructor(public router: Router, private fb: FormBuilder, public service: ConexionService) {
  }

  ngOnInit() { this.obtenerRecetas() }

  //-------------------------------------------- Formato de la hora--------------------------------------
  formatoHora(hora: string): string {
    const [horas, minutos] = hora.split(':');
    const fecha = new Date();
    fecha.setHours(+horas, +minutos);
    return fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  //-------------------------------------------- Manejo de los modales editar--------------------------------------

  @ViewChild('editarReceta') editarReceta!: ElementRef;

  abrirModalEditar(id: any) {
    this.editarReceta.nativeElement.showModal();
    this.obtenerUnaReceta(id);
  }

  //-------------------------------------------- Calculo de la edad del paciente --------------------------------------

  obtenerRecetas() {
    this.service.get('consulta/getAll').subscribe((info: any) => {

      if (info) {
        this.recetas = info.data;
      }
    })
  }

  obtenerUnaReceta(id: any) {
    this.service.get(`consulta/getOne/${id}`).subscribe((info: any) => {

      if (info.error == false) {
        this.FormularioE.patchValue({
          id: info.data.id,
          idPaciente: info.data.idPaciente,
          idCita: info.data.idCita,
          nombrePaciente: info.data.nombrePaciente,
          apellidoPaternoPaciente: info.data.apellidoPaternoPaciente,
          apellidoMaternoPaciente: info.data.apellidoMaternoPaciente,
          fecha: info.data.fecha,
          hora: info.data.hora,
          prescripcion: info.data.prescripcion,
          recomendaciones: info.data.recomendaciones
        });

        this.recetaSola = info.data.id;
      }
    })
  }

  actualizarReceta(id: any) {

    this.service.put(`consulta/update/${id}`, this.FormularioE.value).subscribe((info: any) => {

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


  eliminarReceta(id: any) {

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

        this.service.delete(`consulta/delete/${id}`).subscribe((info: any) => {

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


  //-------------------------------------------- Valdacion de campos -------------------------------------

  campoValidoEditar(campo: string) {
    return this.FormularioE.controls[campo].errors && this.FormularioE.controls[campo].touched;
  };


}
