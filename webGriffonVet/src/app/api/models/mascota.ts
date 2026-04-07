export interface Mascota {
  id_mascota: number;
  nombre: string;
  especie: string;
  raza: string;
  tamanio: string;
  fecha_nacimiento: string;
  sexo: string;
  tipo_pelaje: string;
  castrado:boolean;
  comportamiento: string;
  observaciones: string;
  pesos: peso[];
  alergias: alergia[];
  vacunas: vacuna[];
  desparasitaciones: desparasitacion[];
  enfermedades : enfermedad[];
  historia_clinica : historia_clinica;
}
export interface peso{
  fecha: Date;
  peso: string;
  observaciones: string;
}
export interface alergia{
  nombre: string;
  severidad: string;
  observaciones: string;
}
export interface vacuna{
  nombre: string;
  fecha_aplicacion: Date;
  proxima_dosis: Date;
  observaciones?:string;
}
export interface desparasitacion{
  nombre: string;
  tipo:string;
  fecha_aplicacion: Date;
  proxima_dosis: Date;
  observaciones?:string;
}
export interface enfermedad{
  nombre:string;
  estado:string;
  fecha_diagnostico:Date;
}
export interface historia_clinica{
  id_historia_clinica: number;
  consultas: consulta[];
}
export interface consulta{
  id_consulta: number;
  fecha: Date;
  motivo_consulta: string;
  diagnostico: string;
  tratamiento: string;
  tratamientos: tratamiento[];
  estudios: estudio[];
  archivos: archivo[];

}
export interface tratamiento{
  nombre: string;
  dosis: string;
  frecuencia: string;
  duracion_dias: number;
}
export interface estudio{
  tipo_estudio:string;
  resultado:string;
  fecha:Date;
}

export interface archivo{
  url_archivo: string;
  tipo_archivo: string;
  descripcion: string;
}