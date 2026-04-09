import { Component, EventEmitter, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ClienteService } from "../../../core/services/cliente-service";
import { ToastService } from "../../../core/services/toast.service";
import { ErrorModalService } from "../../../core/services/error-modal";
@Component({
  selector: "app-nuevo-cliente-desde-admin",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./nuevo-cliente-desde-admin.html",
  styleUrl: "./nuevo-cliente-desde-admin.css",
})
export class NuevoClienteDesdeAdmin {
  @Output() cerrar = new EventEmitter<void>();
  @Output() clienteGuardado = new EventEmitter<void>();

  constructor(
    private service: ClienteService,
    private toast: ToastService,
    private errorModal: ErrorModalService,
  ) {}

  formCliente = {
    cliente: {
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      password: "",
    },
    mascota: {
      nombre: "",
      especie: "",
      raza: "",
      tamanio: "",
      fecha_nacimiento: "",
      sexo: "",
      tipo_pelaje: "",
      observaciones: "",
      castrado: false,
    },
  };

  guardar() {
    // 🔒 VALIDACIONES CLIENTE
    if (!this.formCliente.cliente.nombre.trim()) {
      this.errorModal.mostrar("El nombre es obligatorio");
      return;
    }

    if (!this.formCliente.cliente.apellido.trim()) {
      this.errorModal.mostrar("El apellido es obligatorio");
      return;
    }

    if (!this.formCliente.cliente.email.trim()) {
      this.errorModal.mostrar("El email es obligatorio");
      return;
    }

    if (!this.formCliente.cliente.password.trim()) {
      this.errorModal.mostrar("La contraseña es obligatoria");
      return;
    }

    // 🔒 VALIDACIONES MASCOTA
    if (!this.formCliente.mascota.nombre.trim()) {
      this.errorModal.mostrar("El nombre de la mascota es obligatorio");
      return;
    }

    if (!this.formCliente.mascota.especie.trim()) {
      this.errorModal.mostrar("La especie es obligatoria");
      return;
    }

    if (!this.formCliente.mascota.tamanio.trim()) {
      this.errorModal.mostrar("El tamaño es obligatorio");
      return;
    }
    if (!this.formCliente.mascota.sexo.trim()) {
      this.errorModal.mostrar("El sexo es obligatorio");
      return;
    }
    // 🚀 REQUEST
    this.service.insertarCliente(this.formCliente).subscribe({
      next: () => {
        // ✅ TOAST
        this.toast.mostrar("Cliente registrado correctamente");

        this.clienteGuardado.emit();
        this.cerrar.emit();
      },
      error: (err) => {
        const mensaje = err?.error?.mensaje || "Error al registrar el cliente";

        // ❌ MODAL
        this.errorModal.mostrar(mensaje);
      },
    });
  }
}
