export interface MascotaUsuario {
  id_mascota: number;
  nombre: string;
  especie: string;       
  raza?: string;
  sexo?: string;
  tamanio:string;
  fecha_nacimiento: string;
  comportamiento:string;
  observaciones:string;
  tipo_pelaje:string;
}

export interface MascotaRequest {
  id_usuario: number;
  nombre: string;
  especie: string;       
  raza?: string;
  sexo?: string;
  tamanio:string;
  fecha_nacimiento: string;
  comportamiento:string;
  observaciones:string;
  tipo_pelaje:string;
}
