import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
 private apiUrl = environment.apiUrl;
 private loggedIn$ = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  /* =========================
     AUTH API
     ========================= */

 login(correo: string, clave: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(
      `${this.apiUrl}/login`,
      { email: correo, password: clave }
    );
  }
/*
 registrarCliente(cliente: ICliente): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}/registrarCliente`,
      cliente
    );
  }*/

 
  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string): void {
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
