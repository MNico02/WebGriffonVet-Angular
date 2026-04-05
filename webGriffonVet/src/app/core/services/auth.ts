import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export interface RegistroPayload {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private loggedIn$ = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  login(correo: string, clave: string): Observable<{ token: string; rol: string }> {
    return this.http.post<{ token: string; rol: string }>(
      `${this.apiUrl}/login`,
      { email: correo, password: clave }
    );
  }

  registro(payload: RegistroPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios/registro`, payload);
  }

  
  private decodificarToken(): any {
    const token = this.getToken();
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  getIdUsuario(): number {
    return this.decodificarToken()?.id_usuario ?? 0;
  }

  getEmail(): string {
    return this.decodificarToken()?.sub ?? ''; 
  }

  isTokenExpirado(): boolean {
    const payload = this.decodificarToken();
    if (!payload?.exp) return true;
    return Date.now() >= payload.exp * 1000;
  }
  // ─────────────────────────────────────────────────────────────────────────

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRol(): string | null {
    return this.decodificarToken()?.rol ?? null;
  }

  setSession(token: string): void {
    localStorage.setItem('token', token);
    this.loggedIn$.next(true);
  }

  logout(): void {
    localStorage.clear();
    this.loggedIn$.next(false);
  }

  isLoggedIn(): boolean {
    return this.loggedIn$.value;
  }

  isLoggedIn$(): Observable<boolean> {
    return this.loggedIn$.asObservable();
  }
}