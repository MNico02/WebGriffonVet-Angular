import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { tratamiento } from '../../api/models/mascota';
import { NuevoTratamientoRequest, NuevaConsultaRequest } from '../../api/models/nuevaconsulta';
import { ConsultaService } from '../../core/services/consulta-service';

@Component({
  selector: 'app-nueva-consulta-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './nueva-consulta.html',
  styleUrl: './nueva-consulta.css'
})
export class NuevaConsulta {
 mascotaId = input.required<number>();
  usuarioId = input.required<number>();
  private consultaService = inject(ConsultaService);

  cerrar = output<void>();
  consultaGuardada = output<void>();

  form: NuevaConsultaRequest = {
    id_usuario: 0,
    id_mascota: 0,
    motivo_consulta: '',
    anamnesis: '',
    examen_general: '',
    diagnostico: '',
    tratamiento: '',
    observaciones: '',
    tratamientos: [],
    estudios: [],
    archivos: []
  };

  nuevoTratamiento: NuevoTratamientoRequest = {
    nombre_medicamento: '',
    dosis: '',
    frecuencia: '',
    duracion_dias: 0,
    indicaciones: ''
  };

  agregarTratamiento() {
    if (!this.nuevoTratamiento.nombre_medicamento) return;
    this.form.tratamientos.push({ ...this.nuevoTratamiento });
    this.nuevoTratamiento = {
      nombre_medicamento: '',
      dosis: '',
      frecuencia: '',
      duracion_dias: 0,
      indicaciones: ''
    };
  }

  eliminarTratamiento(index: number) {
    this.form.tratamientos.splice(index, 1);
  }

  guardar() {
    const payload: NuevaConsultaRequest = {
      ...this.form,
      id_usuario: this.usuarioId(),
      id_mascota: this.mascotaId()
    };

    console.log('Payload a enviar:', payload); // verificá que esté bien antes de conectar el servicio

     this.consultaService.crearConsulta(payload).subscribe(() => {
       this.consultaGuardada.emit();
       this.cerrar.emit();
     });
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.cerrar.emit();
    }
  }
}