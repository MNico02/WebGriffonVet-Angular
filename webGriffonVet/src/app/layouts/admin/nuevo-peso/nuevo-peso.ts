import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HistorialClinicoService } from '../../../core/services/historial-clinico-service';
import { pesoMascotaRequest } from '../../../api/models/historialClinico';

@Component({
  selector: 'app-nuevo-peso',
  imports: [CommonModule, FormsModule],
  templateUrl: './nuevo-peso.html',
  styleUrl: './nuevo-peso.css'
})
export class NuevoPeso {

  mascotaId = input.required<number>();
  usuarioId = input.required<number>();
  private service = inject(HistorialClinicoService);

  cerrar = output<void>();
  pesoGuardado = output<void>();

  form: pesoMascotaRequest = {
    id_mascota: 0,
    id_usuario: 0,
    fecha: '',
    peso: 0,
    observaciones: ''
  };

  guardar() {
    const payload: pesoMascotaRequest = {
      ...this.form,
      id_usuario: this.usuarioId(),
      id_mascota: this.mascotaId()
    };

    console.log('Payload peso:', payload);

    this.service.insertarPeso(payload).subscribe(() => {
      this.pesoGuardado.emit();
      this.cerrar.emit();
    });
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.cerrar.emit();
    }
  }
}