import { Component, input, output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlergiaService } from '../../core/services/alergia-service';
import { alergia, alergiaMascotaRequest } from '../../api/models/alergia';

@Component({
  selector: 'app-nueva-alergia',
  imports: [CommonModule, FormsModule],
  templateUrl: './nueva-alergia.html',
  styleUrl: './nueva-alergia.css',
})
export class NuevaAlergia implements OnInit {
  mascotaId = input.required<number>();
  usuarioId = input.required<number>();
  private alergiaService = inject(AlergiaService);

  cerrar = output<void>();
  alergiaGuardada = output<void>();

  alergias: alergia[] = [];
  cargandoAlergias = false;

  nuevaAlergiaNombre = '';
  agregandoAlergia = false;

  severidades = ['LEVE', 'MEDIA', 'ALTA'];

  form: alergiaMascotaRequest = {
    id_mascota: 0,
    id_usuario: 0,
    id_alergia: 0,
    severidad: '',
    observaciones: '',
  };

  ngOnInit() {
    this.cargarAlergias();
  }

  cargarAlergias() {
    this.cargandoAlergias = true;
    this.alergiaService.obtenerAlergia().subscribe({
      next: (data: alergia[]) => {
        this.alergias = data;
        this.cargandoAlergias = false;
        this.agregandoAlergia = false;
      },
      error: () => {
        this.cargandoAlergias = false;
        this.agregandoAlergia = false;
      },
    });
  }

  insertarAlergia() {
    if (!this.nuevaAlergiaNombre.trim()) return;
    this.agregandoAlergia = true;
    this.alergiaService.insertarAlergiaCatalogo(this.nuevaAlergiaNombre.trim()).subscribe({
      next: () => {
        this.nuevaAlergiaNombre = '';
        this.cargarAlergias();
      },
      error: () => {
        this.agregandoAlergia = false;
      },
    });
  }

  guardar() {
    const payload: alergiaMascotaRequest = {
      ...this.form,
      id_usuario: this.usuarioId(),
      id_mascota: this.mascotaId(),
    };

    console.log('Payload alergia:', payload);

    this.alergiaService.insertarAlergia(payload).subscribe(() => {
      this.alergiaGuardada.emit();
      this.cerrar.emit();
    });
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.cerrar.emit();
    }
  }
  getSeveridadActivaClass(s: string): string {
    const clases: Record<string, string> = {
      LEVE: 'flex-1 py-2 rounded-lg text-xs font-bold border-2 border-tertiary bg-tertiary-container/30 text-tertiary transition-all',
      MEDIA:
        'flex-1 py-2 rounded-lg text-xs font-bold border-2 border-secondary bg-secondary-container/30 text-secondary transition-all',
      ALTA: 'flex-1 py-2 rounded-lg text-xs font-bold border-2 border-error bg-error-container/30 text-error transition-all',
    };
    return clases[s] ?? '';
  }
}
