
export interface Cliente {
  id_usuario: number;
  nombre_completo: string;
  email: string;
  telefono: string;
  activo: boolean;
  mascotas: Mascota[];
}
export interface Mascota {
  id_mascota: number;
  nombre_mascota: string;
  especie: string;
  sexo?: string;
}



