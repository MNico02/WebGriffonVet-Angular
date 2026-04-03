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
      return this.http.post<any>(`${this.apiUrl}/obtenerMascota`, {
        id_usuario: usuarioId,
        id_mascota: mascotaId
      }).pipe(
        map(response => {
          const key = 'JSON_F52E2B61-18A1-11d1-B105-00805F49916B';
          const jsonString = response[0][key];
          if (!jsonString) throw new Error(`Respuesta vacía para mascota ${mascotaId}`);
          return JSON.parse(jsonString) as Mascota;
        })
      );
    }
}
