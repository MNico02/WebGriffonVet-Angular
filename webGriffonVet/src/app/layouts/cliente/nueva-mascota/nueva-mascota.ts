import { Component, output, input ,inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MascotaService } from '../../../core/services/mascota-service';
import { MascotaRequest } from '../../../api/models/mascota-usuario.model';
import { ToastService } from '../../../core/services/toast.service';
import { ErrorModalService } from '../../../core/services/error-modal';
@Component({
  selector: 'app-nueva-mascota',
  imports: [CommonModule, FormsModule],
  templateUrl: './nueva-mascota.html',
  styleUrl: './nueva-mascota.css',
})
export class NuevaMascota {
  private toast = inject(ToastService);
private errorModal = inject(ErrorModalService);
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

  // 🔒 VALIDACIONES

  if (!this.formMascota.nombre.trim()) {
    this.errorModal.mostrar('El nombre de la mascota es obligatorio');
    return;
  }

  if (!this.formMascota.especie.trim()) {
    this.errorModal.mostrar('Seleccioná una especie');
    return;
  }
if (!this.formMascota.raza.trim()) {
    this.errorModal.mostrar('Seleccioná una raza');
    return;
  }
  if (!this.formMascota.tamanio.trim()) {
    this.errorModal.mostrar('Seleccioná un tamaño');
    return;
  }
if (!this.formMascota.fecha_nacimiento.trim()) {
    this.errorModal.mostrar('Seleccioná la fecha de nacimiento');
    return;
  }
  if (!this.formMascota.sexo.trim()) {
    this.errorModal.mostrar('Seleccioná el sexo');
    return;
  }

  if (!this.formMascota.tipo_pelaje.trim()) {
    this.errorModal.mostrar('selecciona un pelaje');
    return;
  }


  // 🚀 PAYLOAD
  const payload: MascotaRequest = {
    ...this.formMascota,
    id_usuario: this.usuarioId(),
  };

  this.service.insertarMascota(payload).subscribe({
    next: () => {

      // ✅ TOAST
      this.toast.mostrar('Mascota registrada correctamente');

      this.mascotaGuardada.emit();
      this.cerrar.emit();
    },
    error: (err) => {

      const mensaje = err?.error?.mensaje || 'Error al registrar la mascota';

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
