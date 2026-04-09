import { Component, input, output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HistorialClinicoService } from '../../core/services/historial-clinico-service';
import { editarMascotaRequest } from '../../api/models/historialClinico';
import { ToastService } from '../../core/services/toast.service';
import { ErrorModalService } from '../../core/services/error-modal';
@Component({
  selector: 'app-editar-mascota',
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-mascota.html',
  styleUrl: './editar-mascota.css',
})
export class EditarMascota implements OnInit {
  mascotaId = input.required<number>();
  usuarioId = input.required<number>();
  mascota = input.required<editarMascotaRequest>();
  private service = inject(HistorialClinicoService);
private toast = inject(ToastService);
private errorModal = inject(ErrorModalService);
  cerrar = output<void>();
  mascotaEditada = output<void>();

  especies = ['PERRO', 'GATO', 'AVE', 'CONEJO', 'REPTIL', 'OTRO'];
  tamanios = ['CHICO', 'MEDIANO', 'GRANDE'];
  sexos = ['MACHO', 'HEMBRA'];

  form: editarMascotaRequest = {
    id_mascota: 0,
    id_usuario: 0,
    nombre: '',
    especie: '',
    raza: '',
    tamanio: '',
    sexo: '',
    tipo_pelaje: '',
    comportamiento: '',
    observaciones: '',
    fecha_nacimiento: '',
    castrado: false,
  };

  ngOnInit() {
    this.form = {
      ...this.mascota(),
      castrado: this.mascota().castrado ?? false
    };
    console.log('Payload editar mascota:', this.mascota());
  }

  guardar() {

  // 🔒 VALIDACIONES
  if (!this.form.nombre.trim()) {
    this.errorModal.mostrar('El nombre es obligatorio');
    return;
  }

 if (!this.form.especie.trim()) {
    this.errorModal.mostrar('Seleccioná una especie');
    return;
  }
if (!this.form.raza.trim()) {
    this.errorModal.mostrar('Seleccioná una raza');
    return;
  }
  if (!this.form.tamanio.trim()) {
    this.errorModal.mostrar('Seleccioná un tamaño');
    return;
  }
if (!this.form.fecha_nacimiento.trim()) {
    this.errorModal.mostrar('Seleccioná la fecha de nacimiento');
    return;
  }
  if (!this.form.sexo.trim()) {
    this.errorModal.mostrar('Seleccioná el sexo');
    return;
  }

  if (!this.form.tipo_pelaje.trim()) {
    this.errorModal.mostrar('selecciona un pelaje');
    return;
  }

  // 🚀 PAYLOAD
  const payload: editarMascotaRequest = {
    ...this.form,
    id_mascota: this.mascotaId(),
    id_usuario: this.usuarioId(),
  };

  console.log('Payload editar mascota:', payload);

  this.service.editarMascota(payload).subscribe({
    next: () => {

      // ✅ TOAST
      this.toast.mostrar('Mascota actualizada correctamente');

      this.mascotaEditada.emit();
      this.cerrar.emit();
    },
    error: (err) => {

      const mensaje = err?.error?.mensaje || 'Error al actualizar la mascota';

      // ❌ MODAL
      this.errorModal.mostrar(mensaje);
    }
  });
}

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.cerrar.emit();
    }
  }
}
