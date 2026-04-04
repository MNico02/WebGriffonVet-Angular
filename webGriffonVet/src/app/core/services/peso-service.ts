import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,} from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { pesoMascotaRequest } from '../../api/models/peso';

@Injectable({
  providedIn: 'root',
})
export class PesoService {
  constructor(private http: HttpClient) {}
  private apiUrl = environment.apiUrl;

  insertarPeso(payload: pesoMascotaRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/InsertarPeso`, payload);
  }
}
