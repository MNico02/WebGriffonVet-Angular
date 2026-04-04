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

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRol(): string | null {
    return localStorage.getItem('rol');
  }

  setSession(token: string, rol: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('rol', rol);
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