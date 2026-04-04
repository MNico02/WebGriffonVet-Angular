import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,} from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { desparasitacion, desparasitacionMascotaRequest, desparasitacionRequest } from '../../api/models/desparasitacion';



@Injectable({
  providedIn: 'root',
})
export class DesparasitacionService {   
    constructor(private http: HttpClient) {}
    private apiUrl = environment.apiUrl;

    obtenerDesparasitaciones(): Observable<desparasitacion[]> {
    return this.http.get<desparasitacion[]>(`${this.apiUrl}/ObtenerDesparasitaciones`);
  }
  
  insertarDesparasitacion(payload: desparasitacionMascotaRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/InsertarDesparasitacion`,  payload );
  }
  
  insertarTipoDesparasitacion(payload: desparasitacionRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/InsertarTipoDesparasitacion`, payload);
  }
}

