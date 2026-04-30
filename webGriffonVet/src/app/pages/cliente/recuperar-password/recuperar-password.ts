import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth';
import { ToastComponent } from '../../../components/toast/toast';
import { ErrorModalComponent } from '../../../components/error-modal/error-modal';
import { ToastService } from '../../../core/services/toast.service';
import { ErrorModalService } from '../../../core/services/error-modal';

@Component({
  selector: 'app-recuperar-password',
  standalone: true,
  imports: [FormsModule, RouterModule, ToastComponent, ErrorModalComponent],
  templateUrl: './recuperar-password.html',
})
export class RecuperarPassword {
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private errorModal = inject(ErrorModalService);

  email = '';
  enviado = false;
  cargando = false;

  enviar() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.email.trim()) {
      this.errorModal.mostrar('El correo electrónico es obligatorio.');
      return;
    }
    if (!emailRegex.test(this.email.trim())) {
      this.errorModal.mostrar('Ingresá un correo electrónico válido.');
      return;
    }

    this.cargando = true;
    this.auth.recuperarPassword(this.email.trim()).subscribe({
      next: () => {
        this.cargando = false;
        this.enviado = true;
      },
      error: () => {
        this.cargando = false;
        this.enviado = true;
      },
    });
  }
}
