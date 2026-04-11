import { Component, EventEmitter, Output, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ClienteService, Especie } from "../../../core/services/cliente-service";
import { ToastService } from "../../../core/services/toast.service";
import { ErrorModalService } from "../../../core/services/error-modal";

@Component({
  selector: "app-nuevo-cliente-desde-admin",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./nuevo-cliente-desde-admin.html",
  styleUrl: "./nuevo-cliente-desde-admin.css",
})
export class NuevoClienteDesdeAdmin implements OnInit {
  @Output() cerrar = new EventEmitter<void>();
  @Output() clienteGuardado = new EventEmitter<void>();

  especies: Especie[] = [];

  constructor(
    private service: ClienteService,
    private toast: ToastService,
    private errorModal: ErrorModalService,
  ) {}

  ngOnInit(): void {
    this.service.getEspecies().subscribe({
      next: (data) => {
        this.especies = data ?? [];
      },
      error: () => {
        this.errorModal.mostrar("No se pudieron cargar las especies");
      },
    });
  }

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
      id_especie: null as number | null,
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

    if (!this.formCliente.mascota.nombre.trim()) {
      this.errorModal.mostrar("El nombre de la mascota es obligatorio");
      return;
    }

    if (!this.formCliente.mascota.id_especie) {
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

    this.service.insertarCliente(this.formCliente).subscribe({
      next: () => {
        this.toast.mostrar("Cliente registrado correctamente");
        this.clienteGuardado.emit();
        this.cerrar.emit();
      },
      error: (err) => {
        const mensaje = err?.error?.mensaje || "Error al registrar el cliente";
        this.errorModal.mostrar(mensaje);
      },
    });
  }
}