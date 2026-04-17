import { HttpInterceptorFn,  HttpErrorResponse  } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  const publicEndpoints = ['/login', '/registro','/usuarios/activar', '/main/home', '/main/productos', '/main/turnos','/main/blog' ];
  const isPublic = publicEndpoints.some(e => req.url.includes(e));

  if (req.url.includes('amazonaws.com')) {
    return next(req);
  }

  
  if (token && authService.isTokenExpirado() && !isPublic) {
    authService.logout();
    router.navigate(['/login'], {
      queryParams: { reason: 'session-expired' }
    });
    return throwError(() => new Error('Token expirado'));
  }
  

  if (token && !isPublic) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        console.warn('Token inválido o expirado. Cerrando sesión...');
        authService.logout();
        router.navigate(['/login'], {
          queryParams: { returnUrl: router.url, reason: 'session-expired' }
        });
      }
      return throwError(() => error);
    })
  );
};
