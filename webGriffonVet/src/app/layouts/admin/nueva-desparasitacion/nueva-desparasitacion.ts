import { Component, input, output, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HistorialClinicoService } from '../../../core/services/historial-clinico-service';
import {
  desparasitacion,
  desparasitacionMascotaRequest,
  desparasitacionRequest,
} from '../../../api/models/historialClinico';

import { ToastService } from '../../../core/services/toast.service';
import { ErrorModalService } from '../../../core/services/error-modal';
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

  private toast = inject(ToastService);
  private errorModal = inject(ErrorModalService);
  cerrar = output<void>();
  desparasitacionGuardada = output<void>();

  desparasitaciones = signal<desparasitacion[]>([]);
  cargandoDesparasitaciones = signal(false);
  agregandoDesparasitacion = false;

  nuevaDesparasitacionNombre = '';
  nuevaDesparasitacionTipo = '';
  mostrarNuevaDesparasitacion = false;
  form: desparasitacionMascotaRequest = {
    id_mascota: 0,
    id_usuario: 0,
    id_desparasitacion: 0,
    fecha_aplicacion: '',
    proxima_dosis: '',
    observaciones: '',
  };

  ngOnInit() {
    this.cargarDesparasitaciones();
  }

  cargarDesparasitaciones() {
    this.cargandoDesparasitaciones.set(true);
    this.service.obtenerDesparasitaciones().subscribe({
      next: (data) => {
        this.desparasitaciones.set(data);
        this.cargandoDesparasitaciones.set(false);
      },
      error: (err) => {
        this.cargandoDesparasitaciones.set(false);
        this.errorModal.mostrar(
          err?.error?.mensaje || 'No se pudieron cargar las desparasitaciones',
        );
      },
    });
  }

  onDesparasitacionSeleccionada(id: number) {
    const desp = this.desparasitaciones().find((d) => d.id_desparasitacion === +id);
    if (desp) {
      this.form.id_desparasitacion = desp.id_desparasitacion;
    }
  }

  insertarTipoDesparasitacion() {
    if (!this.nuevaDesparasitacionNombre.trim()) return;
    this.agregandoDesparasitacion=true;

    const payload: desparasitacionRequest = {
      nombre: this.nuevaDesparasitacionNombre.trim(),
      tipo: this.nuevaDesparasitacionTipo.trim(),
    };

    const idsAntes = this.desparasitaciones().map((d) => d.id_desparasitacion);

    this.service.insertarTipoDesparasitacion(payload).subscribe({
      next: () => {
        this.nuevaDesparasitacionNombre = '';
        this.nuevaDesparasitacionTipo = '';
        this.mostrarNuevaDesparasitacion = false;
        this.toast.mostrar('Desparasitación agregada correctamente');

        this.service.obtenerDesparasitaciones().subscribe({
          next: (data) => {
            this.desparasitaciones.set(data ?? []);
            this.agregandoDesparasitacion = false;

            const nueva = data.find((d) => !idsAntes.includes(d.id_desparasitacion));
            if (nueva) {
              this.form.id_desparasitacion = nueva.id_desparasitacion;
            }
          },
          error: () => this.agregandoDesparasitacion = false,
        });
      },
      error: (err) => {
        this.agregandoDesparasitacion = false;
        this.errorModal.mostrar(err?.error?.mensaje || 'Error al agregar la desparasitación');
      },
    });
  }

  guardar() {
    const payload: desparasitacionMascotaRequest = {
      ...this.form,
      id_usuario: this.usuarioId(),
      id_mascota: this.mascotaId(),
    };

    console.log('Payload desparasitación:', payload);

    this.service.insertarDesparasitacion(payload).subscribe({
      next: () => {
        this.toast.mostrar('Desparasitación registrada correctamente');

        this.desparasitacionGuardada.emit();
        this.cerrar.emit();
      },
      error: (err) => {
        const mensaje = err?.error?.mensaje || 'Error al guardar la desparasitación';
        this.errorModal.mostrar(mensaje);
      },
    });
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.cerrar.emit();
    }
  }
}
