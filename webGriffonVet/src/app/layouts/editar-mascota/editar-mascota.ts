import { Component, input, output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MascotaService } from '../../core/services/mascota-service';
import { editarMascota } from '../../api/models/editarMascota';


@Component({
  selector: 'app-editar-mascota',
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-mascota.html',
  styleUrl: './editar-mascota.css'
})
export class EditarMascota implements OnInit {

  mascotaId = input.required<number>();
  usuarioId = input.required<number>();
  mascota = input.required<editarMascota>();
  private mascotaService = inject(MascotaService);

  cerrar = output<void>();
  mascotaEditada = output<void>();

  especies = ['Perro', 'Gato', 'Ave', 'Conejo', 'Reptil', 'Otro'];
  tamanios = ['PEQUEÑO', 'MEDIANO', 'GRANDE'];
  sexos = ['MACHO', 'HEMBRA'];

  form: editarMascota = {
    id_usuario: 0,
    id_mascota: 0,
    nombre: '',
    especie: '',
    raza: '',
    tamanio: '',
    sexo: '',
    tipo_pelaje: '',
    comportamiento: '',
    observaciones: '',
    fecha_nacimiento: ''
  };

  ngOnInit() {
  this.form = { ...this.mascota() };
}

  guardar() {
    const payload: editarMascota = {
      ...this.form,
      id_usuario: this.usuarioId(),
      id_mascota: this.mascotaId()
    };

    console.log('Payload editar mascota:', payload);

    this.mascotaService.editarMascota(payload).subscribe(() => {
      this.mascotaEditada.emit();
      this.cerrar.emit();
    });
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.cerrar.emit();
    }
  }
}