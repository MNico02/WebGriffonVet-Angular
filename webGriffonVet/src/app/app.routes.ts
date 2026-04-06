import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard-guard';
import { roleGuard } from './guards/role-guard-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/cliente/login/login').then((m) => m.Login),
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/cliente/registro/registro').then((m) => m.Registro),
  },
  {
    path: 'main',
    loadComponent: () => import('./layouts/cliente/main-layout/main').then((m) => m.Main),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/cliente/home/home').then((m) => m.Home),
      },
      {
        path: 'productos',
        loadComponent: () => import('./pages/cliente/productos/productos').then((m) => m.Productos),
      },
      {
        path: 'mis-mascotas',
        loadComponent: () => import('./pages/cliente/mascotas/mascotas').then((m) => m.Mascotas),
        canActivate: [authGuard, roleGuard(['CLIENTE'])],
      },
    ],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./layouts/admin/admin-layout/admin-layout').then((m) => m.AdminLayout),
    canActivate: [authGuard, roleGuard(['ADMIN'])],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/admin/dashboard-admin/dashboard-admin').then((m) => m.DashboardAdmin),
        children: [
          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full',
          },
          {
            path: 'clientes',
            loadComponent: () =>
              import('./pages/admin/clientes-admin/clientes-admin').then((m) => m.ClientesAdmin),
          },
        ],
      },
      {
        path: 'historialClinico/:id',
        loadComponent: () =>
          import('./pages/admin/historial-clinico-admin/historial-clinico-admin').then(
            (m) => m.HistorialClinicoAdmin,
          ),
      },
    ],
  },
  { path: '**', redirectTo: '/main/home' },
];
