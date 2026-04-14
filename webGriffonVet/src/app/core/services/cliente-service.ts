import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Cliente } from '../../api/models/cliente';
import { environment } from '../../../environments/environment.development';

export interface Especie {
  id_especie: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getClientes(): Observable<Cliente[]> {
    return this.http
      .get<{ clientes: Cliente[] }>(`${this.apiUrl}/obtenerClientes`)
      .pipe(map(response => response.clientes));
  }

  getEspecies(): Observable<Especie[]> {
    return this.http
      .get<{ especies: Especie[] }>(`${this.apiUrl}/ObtenerEspecies`)
      .pipe(map(response => response.especies));
  }

  insertarCliente(data: any) {
    return this.http.post(`${this.apiUrl}/insertarClienteMascotaAdmin`, data);
  }
  insertarMascota(data: any) {
  return this.http.post(`${this.apiUrl}/insertarMascotas`, data);
}
}