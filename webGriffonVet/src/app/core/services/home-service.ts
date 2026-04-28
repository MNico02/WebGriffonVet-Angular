import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { DataHome, infoHomeEdit, infoHomeRequest } from '../../api/models/home';

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
  insertarInfoHome(imagen: File | null, payload: infoHomeRequest): Observable<any> {
    const formData = new FormData();
    if (imagen) {
      formData.append('imagen', imagen);
    }
    formData.append('data', JSON.stringify(payload));
    return this.http.post(`${this.apiUrl}/InsertarInfoHome`, formData);
  }

  actualizarInfoHome(payload: infoHomeEdit, imagen: File | null ): Observable<any> {
    const formData = new FormData();
    if (imagen) {
      formData.append('imagen', imagen);
    }
    formData.append('data', JSON.stringify(payload));
    return this.http.post(`${this.apiUrl}/ActualizarInfoHome`, formData);
  }
 
  eliminarInfoHome(id_informacion: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/EliminarInfoHome`,{body: {id_informacion}});
  }

}
  