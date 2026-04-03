import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Cliente } from '../../api/models/cliente';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getClientes(): Observable<Cliente[]> {
    return this.http.get<any[]>(`${this.apiUrl}/obtenerClientes`).pipe(
      map(response => {
        // el back devuelve el JSON como string dentro de una clave rara
        const key = 'JSON_F52E2B61-18A1-11d1-B105-00805F49916B';
        const jsonString = response.map(r => r[key]).join('');
        const parsed = JSON.parse(jsonString);
        return parsed.clientes as Cliente[];
      })
    );
  }

}
