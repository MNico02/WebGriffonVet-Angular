export interface MascotaUsuario {
  id_mascota: number;
  nombre: string;
  especie: string;
  raza: string;
  fecha_nacimiento: string;

  // derivados (opcionales)
  edad?: string;
}