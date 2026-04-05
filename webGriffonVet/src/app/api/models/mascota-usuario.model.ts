export interface MascotaUsuario {
  id_mascota: number;
  nombre: string;
  especie: string;       
  raza?: string;
  sexo?: string;
  fecha_nacimiento: string;
  edad?: string;
}