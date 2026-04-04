import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,} from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { alergia } from '../../api/models/alergia';
import { alergiaMascotaRequest } from '../../api/models/alergia';

@Injectable({
  providedIn: 'root',
})
export class AlergiaService {
    constructor(private http: HttpClient) {}
        private apiUrl = environment.apiUrl;
  
        obtenerAlergia(): Observable<alergia[]> {
        return this.http.get<alergia[]>(`${this.apiUrl}/ObtenerAlergias`);
      }
      
      insertarAlergiaCatalogo(nombre: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/InsertarAlergiaCatalogo`, { nombre });
      }
      
      insertarAlergia(payload: alergiaMascotaRequest): Observable<any> {
        return this.http.post(`${this.apiUrl}/InsertarAlergia`, payload);
      }
}
