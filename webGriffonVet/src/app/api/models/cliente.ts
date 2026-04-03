
export interface Cliente {
  id_usuario: number;
  nombre: string;
  apellido: string;
  nombre_completo: string;
  email: string;
  telefono: string;
  activo: boolean;
  fecha_alta: string;
  mascotas: Mascota[];
}
export interface Mascota {
  id_mascota: number;
  nombre_mascota: string;
  especie: string;
  raza: string;
  tamanio: string;
  edad: number;
  sexo: string;
  tipo_pelaje: string;
  comportamiento: string;
  activo: boolean;
  fecha_registro: string;
}



