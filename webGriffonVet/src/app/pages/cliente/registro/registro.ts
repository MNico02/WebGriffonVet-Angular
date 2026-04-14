import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../../core/services/auth";
import { ChangeDetectorRef } from "@angular/core";
import { ToastService } from "../../../core/services/toast.service";
import { ErrorModalService } from "../../../core/services/error-modal";
import { inject } from "@angular/core";
import { ToastComponent } from "../../../components/toast/toast";
import { ErrorModalComponent } from "../../../components/error-modal/error-modal";
@Component({
  selector: "app-registro",
  standalone: true,
  imports: [FormsModule, RouterModule, ToastComponent, ErrorModalComponent],
  templateUrl: "./registro.html",
  styleUrl: "./registro.css",
})
export class Registro {
  nombre = "";
  apellido = "";
  email = "";
  telefono = "";
  password = "";

  cargando = false;

  private toast = inject(ToastService);
  private errorModal = inject(ErrorModalService);

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  registro() {
    if (!this.nombre.trim()) {
      this.errorModal.mostrar("El nombre es obligatorio");
      return;
    }

    if (!this.apellido.trim()) {
      this.errorModal.mostrar("El apellido es obligatorio");
      return;
    }

    if (!this.email.trim()) {
      this.errorModal.mostrar("El email es obligatorio");
      return;
    }

    if (!this.telefono.trim()) {
      this.errorModal.mostrar("El teléfono es obligatorio");
      return;
    }

    if (!this.password.trim() || this.password.length < 8) {
      this.errorModal.mostrar("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    this.cargando = true;

    this.authService
      .registro({
        nombre: this.nombre,
        apellido: this.apellido,
        email: this.email,
        telefono: this.telefono,
        password: this.password,
      })
      .subscribe({
        next: () => {
          this.cargando = false;

          // ✅ TOAST
          this.toast.mostrar('Cuenta creada correctamente, revisa tu email para la activación', 'success', 20000);
        },
        error: (err) => {
          this.cargando = false;

          const mensaje =
            err?.error?.mensaje ||
            err?.error?.error ||
            err?.error?.message ||
            "Error al registrarse";

          this.errorModal.mostrar(mensaje);
        },
      });
  }
}
