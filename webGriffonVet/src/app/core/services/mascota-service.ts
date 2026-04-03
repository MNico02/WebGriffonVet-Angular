import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map} from 'rxjs';
import { Mascota } from '../../api/models/mascota';
import { environment } from '../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class MascotaService {
  constructor(private http: HttpClient) {}

  private apiUrl = environment.apiUrl;

      getMascota(mascotaId: number, usuarioId: number): Observable<Mascota> {
      return this.http.post<Mascota>(`${this.apiUrl}/obtenerMascota`, {
        id_usuario: usuarioId,
        id_mascota: mascotaId
      }).pipe(
    map(mascota => {
      mascota.historia_clinica?.consultas?.forEach(c => {
        c.tratamientos = c.tratamientos ?? [];
        c.estudios     = c.estudios     ?? [];
      });
      return mascota;
    })
  );
  }
}
