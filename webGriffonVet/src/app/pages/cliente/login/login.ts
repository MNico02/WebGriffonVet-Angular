import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule  } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone: true
})
export class Login {

  correo = '';
  clave = '';
  error = '';
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
    this.authService.login(this.correo, this.clave).subscribe({
      next: res => {
        this.authService.setSession(res.token, res.rol);
        localStorage.setItem('email', this.correo);
        this.redirigirPorRol(res.rol);
      },
      error: (err) => {
        this.error = err?.error?.error 
                  || err?.error?.message 
                  || 'Error al iniciar sesión';
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
