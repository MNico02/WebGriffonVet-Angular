export interface desparasitacion{
    id_desparasitacion: number;
    nombre: string;
    tipo: string;
}
export interface desparasitacionRequest{
    nombre : string;
    tipo: string;
}
export interface desparasitacionMascotaRequest{
    id_usuario : number;
    id_mascota : number;
    id_desparasitacion : number;
    observaciones: string;
    fecha_aplicacion: string;
    proxima_dosis: string;
}