 export  interface ProductoRequest {
  nombre: string;
  descripcion: string;
  precio: number | null;
  id_categoria: number;
  imagen_url: string;
  stock: number | null;
}
 export  interface ProductoEditarRequest {
   id_producto: number;  
  nombre: string;
  descripcion: string;
  precio: number | null;
  id_categoria: number;
  imagen_url: string;
  stock: number | null;
}

export interface Producto{
    id_producto: number;
    nombre: string;
    descripcion: string;
    precio: number | null;
    id_categoria: number;
    categoria: string;
    stock: number | null;
    imagen_url: string;
    activo: boolean;
    fecha_alta:Date;
}

export interface Categoria{
    id_categoria: number;
    nombre: string;
}
