export interface servicio {
  id_servicio: number;
  nombre: string;
  descripcion: string;
  precios: precio[];
}
export interface precio {
  tamanio: string;
  precio: string;
  duracion: number;
}

export interface servicioRequest {
  nombre: string;
  descripcion: string;
  precios: precio[];
}
