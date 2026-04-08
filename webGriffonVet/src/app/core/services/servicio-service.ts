import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { servicioRequest, servicio } from '../../api/models/servicio';

@Injectable({
  providedIn: 'root',
})
export class ServicioService {
  constructor(private http: HttpClient) {}

  private apiUrl = environment.apiUrl;

  getServicios(): Observable<servicio[]> {
    return this.http
      .get<{ servicios: servicio[] }>(`${this.apiUrl}/ObtenerServicios`, {})
      .pipe(map((response) => response.servicios ?? []));
  }
  insertarServicio(payload: servicioRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/InsertarServicio`, payload);
  }
  actualizarServicio(payload: servicio): Observable<any> {
    return this.http.put(`${this.apiUrl}/ActualizarServicio`, payload);
  }
  eliminarServicio(id_servicio: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/EliminarServicio`, { body: { id_servicio } });
  }
}
