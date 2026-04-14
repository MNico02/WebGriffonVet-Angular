import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule  } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { ToastService } from '../../../core/services/toast.service';
import { ErrorModalService } from '../../../core/services/error-modal';
import { inject } from '@angular/core';
import { ToastComponent } from '../../../components/toast/toast';
import { ErrorModalComponent } from '../../../components/error-modal/error-modal';
@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterModule,ToastComponent,ErrorModalComponent],
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone: true
})
export class Login {
private toast = inject(ToastService);
private errorModal = inject(ErrorModalService);
  correo = '';
  clave = '';

  returnUrl = '/main';

  constructor(
    private authService: AuthService,
    private router: Router,
     private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.returnUrl =
      this.route.snapshot.queryParamMap.get('returnUrl') || '/main';
  }
  login() {

  if (!this.correo.trim()) {
    this.errorModal.mostrar('El correo es obligatorio');
    return;
  }

  if (!this.clave.trim()) {
    this.errorModal.mostrar('La contraseña es obligatoria');
    return;
  }

  this.authService.login(this.correo, this.clave).subscribe({
    next: res => {
      this.authService.setSession(res.token);
      localStorage.setItem('email', this.correo);

      const rol = this.authService.getRol();

      // ✅ TOAST
      this.toast.mostrar('Bienvenido 👋');

      this.redirigirPorRol(rol ?? '');
    },
    error: (err) => {

      const mensaje =
        err?.error?.mensaje ||
        err?.error?.error ||
        err?.error?.message ||
        'Error al iniciar sesión';

      this.errorModal.mostrar(mensaje);
    }
  });
}

  private redirigirPorRol(rol: string): void {
    switch (rol?.toUpperCase()) {
      case 'ADMIN':
        this.router.navigateByUrl('/admin');
        break;
      case 'CLIENTE':
        this.router.navigateByUrl('/');
        break;
      default:
        this.router.navigateByUrl(this.returnUrl);
    }
  }

}
