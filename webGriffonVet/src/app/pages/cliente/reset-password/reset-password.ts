import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth';
import { ToastComponent } from '../../../components/toast/toast';
import { ErrorModalComponent } from '../../../components/error-modal/error-modal';
import { ToastService } from '../../../core/services/toast.service';
import { ErrorModalService } from '../../../core/services/error-modal';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, RouterModule, ToastComponent, ErrorModalComponent],
  templateUrl: './reset-password.html',
})
export class ResetPassword implements OnInit {
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private errorModal = inject(ErrorModalService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  token = '';
  password = '';
  confirmarPassword = '';
  cargando = false;
  exito = false;

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    if (!this.token) {
      this.errorModal.mostrar('El link de recuperación es inválido o expiró.');
    }
  }

  resetear() {
    if (!this.token) {
      this.errorModal.mostrar('El link de recuperación es inválido o expiró.');
      return;
    }
    if (this.password.length < 6) {
      this.errorModal.mostrar('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (this.password !== this.confirmarPassword) {
      this.errorModal.mostrar('Las contraseñas no coinciden.');
      return;
    }

    this.cargando = true;
    this.auth.resetearPassword(this.token, this.password).subscribe({
      next: (res: any) => {
        const parsed = typeof res === 'string' ? JSON.parse(res) : res;
        this.cargando = false;
        this.exito = true;
        this.toast.mostrar(parsed?.mensaje || 'Contraseña actualizada correctamente.', 'success', 4000);
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (err: any) => {
        this.cargando = false;
        const mensaje =
          err?.error?.mensaje ||
          err?.error?.error ||
          err?.error?.message ||
          'El link expiró o es inválido. Solicitá uno nuevo.';
        this.errorModal.mostrar(mensaje);
      },
    });
  }
}
