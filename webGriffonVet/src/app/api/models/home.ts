export interface ServicioHome{
    id_informacion: number;
    titulo: string;
    descripcion:string;
    id_categoria:number;
    categoria:string;
    imagen_url:string;
}
export interface NoticiasHome{
    id_informacion: number;
    titulo: string;
    descripcion:string;
    id_categoria:number;
    categoria:string;
    fecha_publicacion:string;
    imagen_url:string; 
}
export interface DataHome{
    servicios: ServicioHome[];
    noticias: NoticiasHome[];
}
export interface infoHomeRequest{
    titulo: string;
    descripcion:string;
    id_categoria:number;
    fecha_publicacion:string;
    imagen_url:string; 
}