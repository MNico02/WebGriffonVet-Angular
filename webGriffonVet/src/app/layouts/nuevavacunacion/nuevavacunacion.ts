import { Component, input, output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VacunacionService } from '../../core/services/vacunacion-service';

export interface Vacuna {
  id_vacuna: number;
  nombre: string;
}

export interface NuevaVacunacionRequest {
  id_mascota: number;
  id_usuario: number;
  id_vacuna: number;
  nombre_vacuna: string;
  fecha_aplicacion: string;
  proxima_dosis: string;
  observaciones: string;
}

@Component({
  selector: 'app-nueva-vacunacion-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './nuevavacunacion.html',
  styleUrl: './nuevavacunacion.css'
})
export class NuevaVacunacion implements OnInit {
  mascotaId = input.required<number>();
  usuarioId = input.required<number>();
  private vacunacionService = inject(VacunacionService);

  cerrar = output<void>();
  vacunacionGuardada = output<void>();

  vacunas: Vacuna[] = [];
  cargandoVacunas = false;

  nuevaVacunaNombre = '';
  agregandoVacuna = false;

  form: NuevaVacunacionRequest = {
    id_mascota: 0,
    id_usuario: 0,
    id_vacuna: 0,
    nombre_vacuna: '',
    fecha_aplicacion: '',
    proxima_dosis: '',
    observaciones: ''
  };

  ngOnInit() {
    this.cargarVacunas();
  }

  cargarVacunas() {
    this.cargandoVacunas = true;
    this.vacunacionService.obtenerVacunas().subscribe({
      next: (data: Vacuna[]) => {
        this.vacunas = data;
        this.cargandoVacunas = false;
        this.agregandoVacuna = false;
      },
      error: () => {
        this.cargandoVacunas = false;
        this.agregandoVacuna = false;
      }
    });
  }

  onVacunaSeleccionada(id: number) {
    console.log('id recibido:', id);
    console.log('vacunas disponibles:', this.vacunas);
    const vac = this.vacunas.find(v => v.id_vacuna === +id);
    console.log('vacuna encontrada:', vac);
    if (vac) {
      this.form.nombre_vacuna = vac.nombre;
    }
  }
  insertarVacuna() {
    if (!this.nuevaVacunaNombre.trim()) return;
    this.agregandoVacuna = true;
    this.vacunacionService.insertarVacuna(this.nuevaVacunaNombre.trim()).subscribe({
      next: () => {
        this.nuevaVacunaNombre = '';
        this.cargarVacunas();
      },
      error: () => {
        this.agregandoVacuna = false;
      }
    });
  }

  guardar() {
     console.log('form completo:', this.form);
    const payload: NuevaVacunacionRequest = {
      ...this.form,
      id_usuario: this.usuarioId(),
      id_mascota: this.mascotaId()
    };

    console.log('Payload vacunación:', payload);

    this.vacunacionService.insertarVacunacion(payload).subscribe(() => {
      this.vacunacionGuardada.emit();
      this.cerrar.emit();
    });
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.cerrar.emit();
    }
  }
}