export interface ServicioHome{
    id_informacion: number;
    titulo: string;
    descripcion:string;
    id_categoria:number;
    categoria:string;
    imagen_url:string | null ;
}
export interface NoticiasHome{
    id_informacion: number;
    titulo: string;
    descripcion:string;
    id_categoria:number;
    categoria:string;
    fecha_publicacion:string | null ;
    imagen_url:string | null ; 
}
export interface DataHome{
    servicios: ServicioHome[];
    noticias: NoticiasHome[];
}
export interface infoHomeRequest{
    titulo: string;
    descripcion:string;
    id_categoria:number;
    fecha_publicacion:string | null ;
    imagen_url:string | null ; 
}

export interface infoHomeEdit {
  id_informacion: number;
  titulo: string;
  descripcion: string;
  id_categoria: number | null;
  imagen_url: string | null ;
  fecha_publicacion: string | null ;
}