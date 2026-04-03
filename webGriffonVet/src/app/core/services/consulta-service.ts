import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,} from 'rxjs';
import { NuevaConsultaRequest } from '../../api/models/nuevaconsulta';
import { environment } from '../../../environments/environment.development';


@Injectable({
  providedIn: 'root',
})
export class ConsultaService {
    constructor(private http: HttpClient) {}
     private apiUrl = environment.apiUrl;

  crearConsulta(payload: NuevaConsultaRequest): Observable<any> {
  return this.http.post(`${this.apiUrl}/nuevaConsulta`, payload);
}
}
