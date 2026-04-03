
export interface NuevaConsultaRequest {
  id_usuario: number;
  id_mascota: number;
  motivo_consulta: string;
  anamnesis: string;
  examen_general: string;
  diagnostico: string;
  tratamiento: string;
  observaciones: string;
  tratamientos: NuevoTratamientoRequest[];
  estudios: any[];
  archivos: any[];
}

export interface NuevoTratamientoRequest {
  nombre_medicamento: string;
  dosis: string;
  frecuencia: string;
  duracion_dias: number;
  indicaciones: string;
}