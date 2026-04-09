import { Component, input, output, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HistorialClinicoService } from "../../../core/services/historial-clinico-service";
import { pesoMascotaRequest } from "../../../api/models/historialClinico";
import { ToastService } from "../../../core/services/toast.service";
import { ErrorModalService } from "../../../core/services/error-modal";
@Component({
  selector: "app-nuevo-peso",
  imports: [CommonModule, FormsModule],
  templateUrl: "./nuevo-peso.html",
  styleUrl: "./nuevo-peso.css",
})
export class NuevoPeso {
  mascotaId = input.required<number>();
  usuarioId = input.required<number>();
  private service = inject(HistorialClinicoService);
  private toast = inject(ToastService);
  private errorModal = inject(ErrorModalService);
  cerrar = output<void>();
  pesoGuardado = output<void>();

  form: pesoMascotaRequest = {
    id_mascota: 0,
    id_usuario: 0,
    fecha: "",
    peso: 0,
    observaciones: "",
  };

  guardar() {
    // 🔒 VALIDACIONES
    if (!this.form.fecha) {
      this.errorModal.mostrar("La fecha es obligatoria");
      return;
    }

    if (!this.form.peso || this.form.peso <= 0) {
      this.errorModal.mostrar("Ingresá un peso válido");
      return;
    }

    // 🚀 PAYLOAD
    const payload: pesoMascotaRequest = {
      ...this.form,
      id_usuario: this.usuarioId(),
      id_mascota: this.mascotaId(),
    };

    console.log("Payload peso:", payload);

    this.service.insertarPeso(payload).subscribe({
      next: () => {
        // ✅ TOAST
        this.toast.mostrar("Peso registrado correctamente");

        this.pesoGuardado.emit();
        this.cerrar.emit();
      },
      error: (err) => {
        const mensaje = err?.error?.mensaje || "Error al registrar el peso";

        // ❌ MODAL
        this.errorModal.mostrar(mensaje);
      },
    });
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains("modal-overlay")) {
      this.cerrar.emit();
    }
  }
}
