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
        this.authService.setToken(res.token);
        localStorage.setItem('email', this.correo);

        this.router.navigateByUrl(this.returnUrl);
      },
      error: () => {
        this.error =`Usuario o contraseña incorrectos`;
      }
    });
  }

}
