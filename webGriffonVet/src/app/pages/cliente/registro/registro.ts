import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {

  nombre    = '';
  apellido  = '';
  email     = '';
  telefono  = '';
  password  = '';

  error    = '';
  exito    = false;
  cargando = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  registro() {
    this.error = '';
    this.exito = false;
    this.cargando = true;

    this.authService.registro({
      nombre:   this.nombre,
      apellido: this.apellido,
      email:    this.email,
      telefono: this.telefono,
      password: this.password,
    }).subscribe({
      next: () => {
        this.exito = true;
        // Redirige al login después de 1.5s para que el usuario vea el mensaje
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.cargando = false;
        this.error = err?.error?.error
                  || err?.error?.message
                  || 'Error al registrarse. Intentá de nuevo.';
      }
    });
  }
}