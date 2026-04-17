import { Component, input, output, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HistorialClinicoService } from '../../../core/services/historial-clinico-service';
import { Vacuna, NuevaVacunacionRequest } from '../../../api/models/historialClinico';
import { ToastService } from '../../../core/services/toast.service';
import { ErrorModalService } from '../../../core/services/error-modal';
import { SelectConCreacion } from '../select-con-creacion/select-con-creacion';
import {  ItemSeleccionable } from '../../../api/models/itemSeleccionable'

@Component({
  selector: 'app-nueva-vacunacion-modal',
  imports: [CommonModule, FormsModule, SelectConCreacion],
  templateUrl: './nuevavacunacion.html',
  styleUrl: './nuevavacunacion.css',
})
export class NuevaVacunacion implements OnInit {
  mascotaId = input.required<number>();
  usuarioId = input.required<number>();
  private vacunacionService = inject(HistorialClinicoService);
  private toast = inject(ToastService);
  private errorModal = inject(ErrorModalService);

  cerrar = output<void>();
  vacunacionGuardada = output<void>();

  vacunas = signal<Vacuna[]>([]);
  cargandoVacunas = signal(false);
  nuevaVacunaNombre = '';
  agregandoVacuna = false;
  mostrarNuevaVacuna = signal(false);

  // 👇 form como signal
  idVacunaSeleccionada = signal<number>(0);
  nombreVacuna = signal<string>('');
  fechaAplicacion = signal<string>('');
  proximaDosis = signal<string>('');
  observaciones = signal<string>('');

  vacunasComoItems = computed(() =>
  this.vacunas().map(v => ({ id: v.id_vacuna, nombre: v.nombre }))
);

  ngOnInit() {
    this.cargarVacunas();
  }

  cargarVacunas() {
    this.cargandoVacunas.set(true);
    this.vacunacionService.obtenerVacunas().subscribe({
      next: (data: Vacuna[]) => {
        this.vacunas.set(data ?? []);
        this.cargandoVacunas.set(false);
        this.agregandoVacuna = false;
      },
      error: (err) => {
        this.cargandoVacunas.set(false);
        this.agregandoVacuna = false;
        const mensaje = err?.error?.mensaje || 'No se pudieron cargar las vacunas';
        this.errorModal.mostrar(mensaje);
      },
    });
  }

  onVacunaSeleccionada(item: ItemSeleccionable) {
    this.idVacunaSeleccionada.set(item.id);
    this.nombreVacuna.set(item.nombre);
  }

onNuevaVacuna(nombre: string) {
    this.agregandoVacuna = true;
    const idsAntes = this.vacunas().map(v => v.id_vacuna);

    this.vacunacionService.insertarVacuna(nombre).subscribe({
      next: () => {
        this.toast.mostrar('Vacuna agregada correctamente');
        this.vacunacionService.obtenerVacunas().subscribe({
          next: (data) => {
            this.vacunas.set(data ?? []);
            this.agregandoVacuna = false;
            const nueva = data.find(v => !idsAntes.includes(v.id_vacuna));
            if (nueva) {
              this.idVacunaSeleccionada.set(nueva.id_vacuna);
              this.nombreVacuna.set(nueva.nombre);
            }
          }
        });
      },
      error: (err) => {
        this.agregandoVacuna = false;
        this.errorModal.mostrar(err?.error?.mensaje || 'Error al agregar');
      }
    });
  }

  guardar() {
    const payload: NuevaVacunacionRequest = {
      id_mascota: this.mascotaId(),
      id_usuario: this.usuarioId(),
      id_vacuna: this.idVacunaSeleccionada(),
      nombre_vacuna: this.nombreVacuna(),
      fecha_aplicacion: this.fechaAplicacion(),
      proxima_dosis: this.proximaDosis(),
      observaciones: this.observaciones(),
    };

    this.vacunacionService.insertarVacunacion(payload).subscribe({
      next: () => {
        this.toast.mostrar('Vacunación registrada correctamente');
        this.vacunacionGuardada.emit();
        this.cerrar.emit();
      },
      error: (err) => {
        const mensaje = err?.error?.mensaje || 'Error al guardar la vacunación';
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