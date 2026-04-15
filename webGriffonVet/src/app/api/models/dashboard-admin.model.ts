export interface DashboardResumen {
  total_clientes: number;
  total_mascotas: number;
  clientes_nuevos_mes: number;
  mascotas_nuevas_mes: number;
  consultas_mes: number;
}

export interface DashboardMascotaPorEspecie {
  id_especie: number;
  especie: string;
  cantidad: number;
}

export interface DashboardVacunaProxima {
  id_usuario: number;
  cliente: string;
  id_mascota: number;
  mascota: string;
  id_vacuna: number;
  vacuna: string;
  proxima_dosis: string;
  dias_restantes: number;
}

export interface DashboardDesparasitacionProxima {
  id_usuario: number;
  cliente: string;
  id_mascota: number;
  mascota: string;
  id_desparasitacion: number;
  desparasitacion: string;
  tipo: string | null;
  proxima_dosis: string;
  dias_restantes: number;
}

export interface DashboardAlertas {
  vacunas_proximas: DashboardVacunaProxima[];
  desparasitaciones_proximas: DashboardDesparasitacionProxima[];
}

export interface DashboardEspecieMasRegistrada {
  id_especie?: number;
  especie?: string;
  cantidad?: number;
}

export interface DashboardProximoVencimiento {
  tipo?: 'VACUNA' | 'DESPARASITACION';
  cliente?: string;
  mascota?: string;
  nombre_item?: string;
  proxima_dosis?: string;
  dias_restantes?: number;
}

export interface DashboardExtras {
  clientes_con_multiples_mascotas: number;
  especie_mas_registrada: DashboardEspecieMasRegistrada;
  ultima_consulta_fecha: string | null;
  proximo_vencimiento: DashboardProximoVencimiento;
}

export interface DashboardAdminResponse {
  success: number;
  mensaje: string;
  resumen: DashboardResumen;
  mascotas_por_especie: DashboardMascotaPorEspecie[];
  alertas: DashboardAlertas;
  extras: DashboardExtras;
}