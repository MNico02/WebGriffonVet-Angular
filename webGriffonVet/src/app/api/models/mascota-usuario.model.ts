export interface MascotaUsuario {
  id_mascota: number;
  nombre: string;
  id_especie?: number;
  especie: string;       
  raza?: string;
  sexo?: string;
  tamanio:string;
  fecha_nacimiento: string;
  comportamiento:string;
  observaciones:string;
  tipo_pelaje:string;
  castrado?: boolean;
}

export interface MascotaRequest {
  id_usuario: number;
  nombre: string;
  id_especie: number | null;  
  especie?: string;    
  raza: string;
  sexo: string;
  tamanio:string;
  fecha_nacimiento: string;
  comportamiento:string;
  observaciones:string;
  tipo_pelaje:string;
}
