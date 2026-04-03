import { Routes } from '@angular/router';



export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/cliente/login/login').then(m => m.Login),
    data: {}
  },
  {
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
        data: {},
        children:[
          { path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full' 
          },
          {
            path: 'clientes',
            loadComponent: () => import('./pages/admin/clientes-admin/clientes-admin').then(m => m.ClientesAdmin)
          }
        ]
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
