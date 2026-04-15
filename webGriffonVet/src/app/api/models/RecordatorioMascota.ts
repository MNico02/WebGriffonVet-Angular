export interface RecordatorioMascota {
  tipo: 'VACUNA' | 'DESPARASITACION';
  id_registro: number;
  id_item: number;
  nombre: string;
  subtipo?: string | null;
  fecha_proxima: string;
  dias_restantes: number;
  estado: 'HOY' | 'PROXIMO' | 'PENDIENTE';
  observaciones?: string | null;
}

export interface MascotaConRecordatorios {
  id_mascota: number;
  nombre: string;
  especie: string;
  raza: string;
  tamanio: string;
  sexo: string;
  recordatorios: RecordatorioMascota[];
}

export interface RecordatoriosMascotasResponse {
  success: number;
  mensaje: string;
  mascotas: MascotaConRecordatorios[];
}