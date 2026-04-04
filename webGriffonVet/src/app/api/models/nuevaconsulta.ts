
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
  estudios: EstudioRequest[];
  archivos: ArchivoRequest[];
}

export interface NuevoTratamientoRequest {
  id_medicamento: number;
  nombre_medicamento: string;
  dosis: string;
  frecuencia: string;
  duracion_dias: number;
  indicaciones: string;
}

export interface EstudioRequest{
  tipo_estudio: string;
  resultado: string;
  observaciones: string;
}

export interface ArchivoRequest{
  url_archivo: string;
  tipo_archivo: string;
  descripcion: string;
}

