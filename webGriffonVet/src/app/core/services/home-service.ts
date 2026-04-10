import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { DataHome, infoHomeRequest } from '../../api/models/home';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor(private http: HttpClient) {}
  private apiUrl = environment.apiUrl;
  
  obtenerInfoHome(): Observable<DataHome>{
    return this.http.get<{
      success: number;
      mensaje: string;
      data: DataHome;
    }>(`${this.apiUrl}/ObtenerInfoHome`)
    .pipe(map((res) => res.data ?? { servicios: [], noticias: [] }));
  }
  insertarInfoHome(payload: infoHomeRequest ): Observable<any>{
    return this.http.post(`${this.apiUrl}/InsertarInfoHome`,payload);
  }
  actualizarInfoHome(id: number, payload: infoHomeRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/ActualizarInfoHome/${id}`, payload);
  }
 
  eliminarInfoHome(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/EliminarInfoHome/${id}`);
  }

}
  