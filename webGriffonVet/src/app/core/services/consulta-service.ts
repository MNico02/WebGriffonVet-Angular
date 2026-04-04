import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,} from 'rxjs';
import { NuevaConsultaRequest } from '../../api/models/nuevaconsulta';
import { environment } from '../../../environments/environment.development';
import { Medicamento } from '../../api/models/medicamento';

@Injectable({
  providedIn: 'root',
})
export class ConsultaService {
    constructor(private http: HttpClient) {}
     private apiUrl = environment.apiUrl;

  crearConsulta(payload: NuevaConsultaRequest): Observable<any> {
  return this.http.post(`${this.apiUrl}/nuevaConsulta`, payload);
}

obtenerMedicamentos(): Observable<Medicamento[]> {
  return this.http.get<Medicamento[]>(`${this.apiUrl}/ObtenerMedicamentos`);
}
 
insertarMedicamento(nombre: string): Observable<Medicamento> {
  return this.http.post<Medicamento>(`${this.apiUrl}/InsertarMedicamento`, { nombre });
}
}
