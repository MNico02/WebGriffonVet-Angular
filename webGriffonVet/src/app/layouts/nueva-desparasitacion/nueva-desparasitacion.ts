import { Component, input, output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HistorialClinicoService } from '../../core/services/historial-clinico-service';
import { desparasitacion, desparasitacionMascotaRequest, desparasitacionRequest } from '../../api/models/historialClinico';

@Component({
  selector: 'app-nueva-desparasitacion',
  imports: [CommonModule, FormsModule],
  templateUrl: './nueva-desparasitacion.html',
  styleUrl: './nueva-desparasitacion.css',
})
export class NuevaDesparasitacion implements OnInit {

  mascotaId = input.required<number>();
  usuarioId = input.required<number>();
  private service = inject(HistorialClinicoService);

  cerrar = output<void>();
  desparasitacionGuardada = output<void>();

  desparasitaciones: desparasitacion[] = [];
  cargandoDesparasitaciones = false;

  nuevaDesparasitacionNombre = '';
  nuevaDesparasitacionTipo = '';
  agregandoDesparasitacion = false;

  form: desparasitacionMascotaRequest = {
    id_mascota: 0,
    id_usuario: 0,
    id_desparasitacion: 0,
    fecha_aplicacion: '',
    proxima_dosis: '',
    observaciones: ''
  };

  ngOnInit() {
    this.cargarDesparasitaciones();
  }

  cargarDesparasitaciones() {
    this.cargandoDesparasitaciones = true;
    this.service.obtenerDesparasitaciones().subscribe({
      next: (data: desparasitacion[]) => {
        this.desparasitaciones = data;
        this.cargandoDesparasitaciones = false;
        this.agregandoDesparasitacion = false;
      },
      error: () => {
        this.cargandoDesparasitaciones = false;
        this.agregandoDesparasitacion = false;
      }
    });
  }

  onDesparasitacionSeleccionada(id: number) {
    const desp = this.desparasitaciones.find(d => d.id_desparasitacion === +id);
    if (desp) {
      this.form.id_desparasitacion = desp.id_desparasitacion;
    }
  }

  insertarTipoDesparasitacion() {
    if (!this.nuevaDesparasitacionNombre.trim()) return;
    this.agregandoDesparasitacion = true;
    const payload: desparasitacionRequest = {
      nombre: this.nuevaDesparasitacionNombre.trim(),
      tipo: this.nuevaDesparasitacionTipo.trim()
    };
    this.service.insertarTipoDesparasitacion(payload).subscribe({
      next: () => {
        this.nuevaDesparasitacionNombre = '';
        this.nuevaDesparasitacionTipo = '';
        this.cargarDesparasitaciones();
      },
      error: () => {
        this.agregandoDesparasitacion = false;
      }
    });
  }

  guardar() {
    const payload: desparasitacionMascotaRequest = {
      ...this.form,
      id_usuario: this.usuarioId(),
      id_mascota: this.mascotaId()
    };

    console.log('Payload desparasitación:', payload);

    this.service.insertarDesparasitacion(payload).subscribe(() => {
      this.desparasitacionGuardada.emit();
      this.cerrar.emit();
    });
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.cerrar.emit();
    }
  }
}