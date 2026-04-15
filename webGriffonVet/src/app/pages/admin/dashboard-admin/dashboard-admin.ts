import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { DashboardAdminService } from '../../../core/services/dashboard-admin';
import {
  DashboardAdminResponse,
  DashboardVacunaProxima,
  DashboardDesparasitacionProxima,
} from '../../../api/models/dashboard-admin.model';

type AlertaDashboard = {
  tipo: 'VACUNA' | 'DESPARASITACION';
  cliente: string;
  mascota: string;
  nombre_item: string;
  subtipo?: string | null;
  proxima_dosis: string;
  dias_restantes: number;
};

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [RouterModule, CommonModule, DatePipe],
  templateUrl: './dashboard-admin.html',
  styleUrl: './dashboard-admin.css',
})
export class DashboardAdmin implements OnInit {

  // 🔹 STATE
  loading = signal(true);
  dashboard = signal<DashboardAdminResponse | null>(null);
  today = new Date();

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private dashboardService: DashboardAdminService
  ) {}

  ngOnInit(): void {
    this.cargarDashboard();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // 🔹 CARGA DE DATOS
  cargarDashboard(): void {
    this.loading.set(true);

    this.dashboardService.obtenerDashboard().subscribe({
      next: (response) => {
        this.dashboard.set({
          ...response,
          resumen: response.resumen ?? {
            total_clientes: 0,
            total_mascotas: 0,
            clientes_nuevos_mes: 0,
            mascotas_nuevas_mes: 0,
            consultas_mes: 0,
          },
          mascotas_por_especie: response.mascotas_por_especie ?? [],
          alertas: {
            vacunas_proximas: response.alertas?.vacunas_proximas ?? [],
            desparasitaciones_proximas:
              response.alertas?.desparasitaciones_proximas ?? [],
          },
          extras: {
            clientes_con_multiples_mascotas:
              response.extras?.clientes_con_multiples_mascotas ?? 0,
            especie_mas_registrada: response.extras?.especie_mas_registrada ?? {},
            ultima_consulta_fecha: response.extras?.ultima_consulta_fecha ?? null,
            proximo_vencimiento: response.extras?.proximo_vencimiento ?? {},
          },
        });

        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar dashboard', err);
        this.loading.set(false);
      },
    });
  }

  // 🔹 COMPUTED (reemplazan getters)

  resumen = computed(() => this.dashboard()?.resumen);

  especies = computed(() => this.dashboard()?.mascotas_por_especie ?? []);

  vacunasProximas = computed<DashboardVacunaProxima[]>(() =>
    this.dashboard()?.alertas?.vacunas_proximas ?? []
  );

  desparasitacionesProximas = computed<DashboardDesparasitacionProxima[]>(() =>
    this.dashboard()?.alertas?.desparasitaciones_proximas ?? []
  );

  extras = computed(() => this.dashboard()?.extras);

  totalAlertas = computed(() =>
    this.vacunasProximas().length + this.desparasitacionesProximas().length
  );

  alertasSalud = computed<AlertaDashboard[]>(() => {
    const vacunas = this.vacunasProximas().map((v) => ({
      tipo: 'VACUNA' as const,
      cliente: v.cliente,
      mascota: v.mascota,
      nombre_item: v.vacuna,
      proxima_dosis: v.proxima_dosis,
      dias_restantes: v.dias_restantes,
    }));

    const desparasitaciones = this.desparasitacionesProximas().map((d) => ({
      tipo: 'DESPARASITACION' as const,
      cliente: d.cliente,
      mascota: d.mascota,
      nombre_item: d.desparasitacion,
      subtipo: d.tipo,
      proxima_dosis: d.proxima_dosis,
      dias_restantes: d.dias_restantes,
    }));

    return [...vacunas, ...desparasitaciones].sort(
      (a, b) => a.dias_restantes - b.dias_restantes
    );
  });

  maxEspecieCantidad = computed(() => {
    const lista = this.especies();
    if (!lista.length) return 1;
    return Math.max(...lista.map((e) => e.cantidad), 1);
  });

  // 🔹 MÉTODOS UI

  getAlturaBarra(cantidad: number): string {
    const porcentaje = Math.max((cantidad / this.maxEspecieCantidad()) * 100, 12);
    return `${porcentaje}%`;
  }

  getClaseCirculoAlerta(dias: number): string {
    if (dias <= 1) return 'bg-red-100 text-red-600';
    if (dias <= 2) return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  }

  getTextoDias(dias: number): string {
    if (dias === 0) return '0d';
    return `${dias}d`;
  }

  getTituloAlerta(alerta: AlertaDashboard): string {
    return alerta.tipo === 'VACUNA'
      ? 'Vacuna próxima'
      : 'Desparasitación próxima';
  }

  getIconoAlerta(alerta: AlertaDashboard): string {
    return alerta.tipo === 'VACUNA' ? 'vaccines' : 'pet_supplies';
  }

  getColorBarra(index: number): string {
    const colores = [
      'bg-primary/20 text-primary group-hover:bg-primary/30',
      'bg-primary-container/30 text-on-primary-container group-hover:bg-primary-container/40',
      'bg-tertiary-container/30 text-tertiary group-hover:bg-tertiary-container/40',
      'bg-secondary-container/30 text-on-secondary-container group-hover:bg-secondary-container/40',
    ];
    return colores[index % colores.length];
  }

  formatearFecha(fecha: string | null | undefined): string {
    if (!fecha) return '-';
    return fecha;
  }
}