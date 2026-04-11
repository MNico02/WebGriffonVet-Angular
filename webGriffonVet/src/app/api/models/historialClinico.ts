export interface alergia{
    id_alergia: number;
    nombre:string;
}
export interface alergiaMascotaRequest{
    id_mascota:number;
    id_usuario:number;
    id_alergia :number;
    severidad :string; //la severidad solo puede ser leve, media, alta
    observaciones:string;
}

export interface desparasitacion{
    id_desparasitacion: number;
    nombre: string;
    tipo: string;
}
export interface desparasitacionRequest{
    nombre : string;
    tipo: string;
}
export interface desparasitacionMascotaRequest{
    id_usuario: number;
    id_mascota : number;
    id_desparasitacion : number;
    observaciones: string;
    fecha_aplicacion: string;
    proxima_dosis: string;
}

export interface enfermedad{
    id_enfermedad: number;
    nombre:string;
}
export interface enfermedadMascotaRequest{
    id_mascota:number;
    id_usuario:number;
    id_enfermedad:number;
    estado:string;   //el estado solo puede ser ACTIVA, CURADA, CRONICA
    fecha_diagnostico:string;
    observaciones:string;
}

export interface pesoMascotaRequest{
    id_mascota : number;
    id_usuario:number;
    fecha: string;
    peso: number;
    observaciones: string;
}


export interface NuevaConsultaRequest {
  id_mascota: number;
  id_usuario: number;
  motivo_consulta: string;
  anamnesis: string;
  examen_general: string;
  diagnostico_presuntivo: string; 
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
  archivo?: File | null; 
}

export interface ArchivoRequest{
  url_archivo: string;
  tipo_archivo: string;
  descripcion: string;
}

export interface Medicamento{
    id_medicamento: number;
    nombre: string;
}

export interface editarMascotaRequest{
    id_mascota:number;
    id_usuario:number;
    nombre:string;
    id_especie: number | null;
  especie?: string;
    raza:string;
    tamanio:string;
    sexo:string;
    tipo_pelaje:string;
    comportamiento:string;
    observaciones:string;
    fecha_nacimiento:string;
    castrado:boolean;
}

export interface Vacuna {
  id_vacuna: number;
  nombre: string;
}

export interface NuevaVacunacionRequest {
  id_mascota: number;
  id_usuario: number;
  id_vacuna: number;
  nombre_vacuna: string;
  fecha_aplicacion: string;
  proxima_dosis: string;
  observaciones: string;
}
