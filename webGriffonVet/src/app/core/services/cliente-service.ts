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
    return this.http.get<{ clientes: Cliente[] }>(`${this.apiUrl}/obtenerClientes`)
      .pipe(map(response => response.clientes));
  }

 
  insertarCliente(data: any) {
    return this.http.post(`${this.apiUrl}/insertarClienteMascotaAdmin`, data);
  }
}


