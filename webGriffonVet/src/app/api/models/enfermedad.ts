
export interface enfermedad{
    id_enfermedad: number;
    nombre:string;
}
export interface enfermedadMascotaRequest{
    id_usuario: number;
    id_mascota:number;
    id_enfermedad:number;
    estado:string; //el estado solo puede ser ACTIVA, CURADA, CRONICA
    fecha_diagnostico:string;
    observaciones:string;
}