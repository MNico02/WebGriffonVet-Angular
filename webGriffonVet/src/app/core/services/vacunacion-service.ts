import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,} from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { NuevaVacunacionRequest } from '../../layouts/nuevavacunacion/nuevavacunacion';
import { Vacuna } from '../../layouts/nuevavacunacion/nuevavacunacion';

@Injectable({
  providedIn: 'root',
})
export class VacunacionService {
    constructor(private http: HttpClient) {}
     private apiUrl = environment.apiUrl;

    obtenerVacunas(): Observable<Vacuna[]> {
    return this.http.get<Vacuna[]>(`${this.apiUrl}/ObtenerVacunas`);
  }
  
  insertarVacuna(nombre: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/InsertarVacuna`, { nombre });
  }
  
  insertarVacunacion(payload: NuevaVacunacionRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/InsertarVacunacion`, payload);
  }
}
