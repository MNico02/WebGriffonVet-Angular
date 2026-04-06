import { Component, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MascotaService } from '../../../core/services/mascota-service';
import { MascotaRequest } from '../../../api/models/mascota-usuario.model';

@Component({
  selector: 'app-nueva-mascota',
  imports: [CommonModule, FormsModule],
  templateUrl: './nueva-mascota.html',
  styleUrl: './nueva-mascota.css',
})
export class NuevaMascota {
  cerrar = output<void>();
  mascotaGuardada = output<void>();
  usuarioId = input.required<number>();
  constructor(private service: MascotaService) {}

  especies = ['PERRO', 'GATO', 'AVE', 'CONEJO', 'REPTIL', 'OTRO'];
  tamanios = ['CHICO', 'MEDIANO', 'GRANDE'];
  sexos = ['MACHO', 'HEMBRA'];

  formMascota: MascotaRequest = {
    id_usuario: 0,
    nombre: '',
    especie: '',
    raza: '',
    tamanio: '',
    fecha_nacimiento: '',
    sexo: '',
    tipo_pelaje: '',
    observaciones: '',
    comportamiento: '',
  };

  guardar() {
    const payload: MascotaRequest = {
      ...this.formMascota,
      id_usuario: this.usuarioId(),
    };

    this.service.insertarMascota(payload).subscribe({
      next: () => {
        this.mascotaGuardada.emit();
      },
      error: (err) => console.error(err),
    });
  }
  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.cerrar.emit();
    }
  }
}
