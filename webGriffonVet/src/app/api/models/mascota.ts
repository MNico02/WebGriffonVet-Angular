export interface Mascota {
  id_mascota: number;
  nombre: string;
  especie: string;
  raza: string;
  tamanio: string;
  fecha_nacimiento: number;
  sexo: string;
  tipo_pelaje: string;
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
}
export interface desparasitacion{
  nombre: string;
  fecha_aplicacion: Date;
  proxima_dosis: Date;
  tipo:string;
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