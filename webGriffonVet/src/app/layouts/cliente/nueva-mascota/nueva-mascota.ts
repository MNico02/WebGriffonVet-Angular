import { Component, output, input, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MascotaService } from '../../../core/services/mascota-service';
import { MascotaRequest } from '../../../api/models/mascota-usuario.model';
import { ToastService } from '../../../core/services/toast.service';
import { ErrorModalService } from '../../../core/services/error-modal';
import { ClienteService, Especie } from '../../../core/services/cliente-service';

@Component({
  selector: 'app-nueva-mascota',
  imports: [CommonModule, FormsModule],
  templateUrl: './nueva-mascota.html',
  styleUrl: './nueva-mascota.css',
})
export class NuevaMascota implements OnInit {
  private toast = inject(ToastService);
  private errorModal = inject(ErrorModalService);
  private clienteService = inject(ClienteService);

  cerrar = output<void>();
  mascotaGuardada = output<void>();
  usuarioId = input.required<number>();

  constructor(private service: MascotaService) {}

  especies: Especie[] = [];
  tamanios = ['CHICO', 'MEDIANO', 'GRANDE','MUY GRANDE'];
  sexos = ['MACHO', 'HEMBRA'];

  formMascota: MascotaRequest = {
    id_usuario: 0,
    nombre: '',
    id_especie: null,
    raza: '',
    tamanio: '',
    fecha_nacimiento: '',
    sexo: '',
    tipo_pelaje: '',
    observaciones: '',
    comportamiento: '',
  };

  ngOnInit(): void {
    this.clienteService.getEspecies().subscribe({
      next: (data) => {
        this.especies = data ?? [];
      },
      error: () => {
        this.errorModal.mostrar('No se pudieron cargar las especies');
      }
    });
  }

  guardar() {
    if (!this.formMascota.nombre.trim()) {
      this.errorModal.mostrar('El nombre de la mascota es obligatorio');
      return;
    }

    if (!this.formMascota.id_especie) {
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

    const payload: MascotaRequest = {
      ...this.formMascota,
      id_usuario: this.usuarioId(),
    };

    this.service.insertarMascota(payload).subscribe({
      next: () => {
        this.toast.mostrar('Mascota registrada correctamente');
        this.mascotaGuardada.emit();
        this.cerrar.emit();
      },
      error: (err) => {
        const mensaje = err?.error?.mensaje || 'Error al registrar la mascota';
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