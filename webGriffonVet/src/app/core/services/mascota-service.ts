import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Mascota } from '../../api/models/mascota';
import { environment } from '../../../environments/environment.development';
import { MascotaUsuario } from '../../api/models/mascota-usuario.model';

@Injectable({ providedIn: 'root' })
export class MascotaService {
  constructor(private http: HttpClient) {}

  private apiUrl = environment.apiUrl;

  getMascota(mascotaId: number, usuarioId: number): Observable<Mascota> {
    return this.http
      .post<Mascota>(`${this.apiUrl}/obtenerMascota`, {
        id_usuario: usuarioId,
        id_mascota: mascotaId,
      })
      .pipe(
        map((mascota) => {
          mascota.historia_clinica?.consultas?.forEach((c) => {
            c.tratamientos = c.tratamientos ?? [];
            c.estudios = c.estudios ?? [];
          });
          return mascota;
        }),
      );
  }

  getMascotas(): Observable<MascotaUsuario[]> {
    return this.http
      .get<{ success: number; mascotas: MascotaUsuario[] }>(
        `${this.apiUrl}/usuario/obtenerMascotas`, {}
      )
      .pipe(map((response) => response.mascotas ?? []));
  }
}
