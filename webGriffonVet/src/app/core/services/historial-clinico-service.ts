import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import {
  alergia,
  alergiaMascotaRequest,
  Vacuna,
  NuevaVacunacionRequest,
  pesoMascotaRequest,
  enfermedad,
  enfermedadMascotaRequest,
  desparasitacion,
  desparasitacionMascotaRequest,
  desparasitacionRequest,
  NuevaConsultaRequest,
  Medicamento,
  editarMascotaRequest,
} from '../../api/models/historialClinico';
import { map } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class HistorialClinicoService {
  constructor(private http: HttpClient) {}
  private apiUrl = environment.apiUrl;

  obtenerAlergia(): Observable<alergia[]> {
    return this.http
      .get<{
        success: number;
        mensaje: string;
        alergias: alergia[];
      }>(`${this.apiUrl}/ObtenerAlergias`)
      .pipe(map((res) => res.alergias ?? []));
  }

  insertarAlergiaCatalogo(nombre: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/InsertarAlergiaCatalogo`, { nombre });
  }

  insertarAlergia(payload: alergiaMascotaRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/InsertarAlergia`, payload);
  }

  obtenerVacunas(): Observable<Vacuna[]> {
    return this.http
      .get<{ success: number; mensaje: string; vacunas: Vacuna[] }>(`${this.apiUrl}/ObtenerVacunas`)
      .pipe(map((res) => res.vacunas ?? []));
  }

  insertarVacuna(nombre: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/InsertarVacuna`, { nombre });
  }

  insertarVacunacion(payload: NuevaVacunacionRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/InsertarVacunacion`, payload);
  }

  insertarPeso(payload: pesoMascotaRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/InsertarPeso`, payload);
  }
  obtenerEnfermedades(): Observable<enfermedad[]> {
    return this.http
      .get<{
        success: number;
        mensaje: string;
        enfermedades: enfermedad[];
      }>(`${this.apiUrl}/ObtenerEnfermedades`)
      .pipe(map((res) => res.enfermedades ?? []));
  }

  insertarEnfermedadCatalogo(nombre: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/InsertarEnfermedadCatalogo`, { nombre });
  }

  insertarEnfermedad(payload: enfermedadMascotaRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/InsertarEnfermedad`, payload);
  }

  obtenerDesparasitaciones(): Observable<desparasitacion[]> {
    return this.http
      .get<{
        success: number;
        mensaje: string;
        desparasitaciones: desparasitacion[];
      }>(`${this.apiUrl}/ObtenerDesparasitaciones`)
      .pipe(map((res) => res.desparasitaciones ?? []));
  }

  insertarDesparasitacion(payload: desparasitacionMascotaRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/InsertarDesparasitacion`, payload);
  }

  insertarTipoDesparasitacion(payload: desparasitacionRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/InsertarTipoDesparasitacion`, payload);
  }

  crearConsulta(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/nuevaConsulta`, formData);
  }

  obtenerMedicamentos(): Observable<Medicamento[]> {
    return this.http
      .get<{
        success: number;
        mensaje: string;
        medicamentos: Medicamento[];
      }>(`${this.apiUrl}/ObtenerMedicamentos`)
      .pipe(map((res) => res.medicamentos ?? []));
  }

  insertarMedicamento(nombre: string): Observable<Medicamento> {
    return this.http.post<Medicamento>(`${this.apiUrl}/InsertarMedicamento`, { nombre });
  }

  editarMascota(payload: editarMascotaRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/actualizarMascotas`, payload);
  }
  editarConsulta(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/ActualizarConsultaClinica`, formData);
  }
  eliminarConsulta(payload: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/EliminarConsulta`, {
      body: payload,
    });
  }
}
