import { Routes } from '@angular/router';
import { AdminLayout } from './layouts/admin-layout/admin-layout';


export const routes: Routes = [{
    path: 'main',
    loadComponent: () => import('./layouts/main-layout/main').then(m => m.Main),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/cliente/home/home').then(m => m.Home),
        resolve: {},
        providers: [],
        data: {}
      }
    ]
  },
  {
    path: 'admin',
    loadComponent:() => import('./layouts/admin-layout/admin-layout').then(m=>m.AdminLayout),
    // canActivate: [AuthGuard], ← acá agregás el guard cuando tengas auth
    children: [
      { path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full' 
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/admin/dashboard-admin/dashboard-admin').then(m => m.DashboardAdmin),
        resolve: {},
        providers: [],
        data: {}
      },
      {
        path: 'historialClinico/:id',
        loadComponent: () => import('./pages/admin/historial-clinico-admin/historial-clinico-admin').then(m => m.HistorialClinicoAdmin),
        resolve: {},
        providers: [],
        data: {}
      }
    ]
  },
  { path: '**', redirectTo: '/main' }
];
