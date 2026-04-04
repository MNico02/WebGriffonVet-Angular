import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../core/services/auth';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const rol = authService.getRol();

    if (rol && allowedRoles.includes(rol)) {
      return true;
    }

    // Redirige según el rol que tiene
    if (rol === 'ADMIN') router.navigate(['/admin/dashboard']);
    else if (rol === 'CLIENTE') router.navigate(['/main']);
    else router.navigate(['/login']);

    return false;
  };
};