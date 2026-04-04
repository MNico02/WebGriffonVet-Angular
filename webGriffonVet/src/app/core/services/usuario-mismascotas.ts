import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable, map } from 'rxjs';
import { MascotaUsuario } from '../../api/models/mascota-usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioMismascotasService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerMascotas(id_usuario: number): Observable<MascotaUsuario[]> {
    return this.http.post(`${this.apiUrl}/usuario/obtenerMascotas`, { id_usuario })
  .pipe(
    map((res: any) => {
      console.log('RES RAW:', res);

      const parsed = typeof res === 'string' ? JSON.parse(res) : res;

      console.log('PARSED:', parsed);

      return parsed.mascotas || [];
    })
  );
  }
}