import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,} from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { enfermedad } from '../../api/models/enfermedad';
import { enfermedadMascotaRequest } from '../../api/models/enfermedad';

@Injectable({
  providedIn: 'root',
})
export class EnfermedadService {
  constructor(private http: HttpClient) {}
      private apiUrl = environment.apiUrl;

      obtenerEnfermedades(): Observable<enfermedad[]> {
      return this.http.get<enfermedad[]>(`${this.apiUrl}/ObtenerEnfermedades`);
    }
    
    insertarEnfermedadCatalogo(nombre: string): Observable<any> {
      return this.http.post(`${this.apiUrl}/InsertarEnfermedadCatalogo`, { nombre });
    }
    
    insertarEnfermedad(payload: enfermedadMascotaRequest): Observable<any> {
      return this.http.post(`${this.apiUrl}/InsertarEnfermedad`, payload);
    }
}
