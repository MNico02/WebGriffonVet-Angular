import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-activar',
  standalone: true,
  templateUrl: './activar.html',
})
export class Activar implements OnInit {

  estado: 'cargando' | 'ok' | 'error' = 'cargando';
  mensaje = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.estado = 'error';
      this.mensaje = 'Token inválido';
      return;
    }

    this.http.get<any>(`${environment.apiUrl}/usuarios/activar?token=${token}`)
      .subscribe({
        next: (res) => {
          this.estado = 'ok';
          this.mensaje = res.mensaje;

          setTimeout(() => this.router.navigate(['/login']), 2500);
        },
        error: (err) => {
          this.estado = 'error';
          this.mensaje = err?.error?.mensaje || 'Error al activar cuenta';
        }
      });
  }
}