import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { DashboardAdminResponse } from '../../api/models/dashboard-admin.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardAdminService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerDashboard(): Observable<DashboardAdminResponse> {
    return this.http.get<DashboardAdminResponse>(
      `${this.apiUrl}/admin/dashboard`
    );
  }
}