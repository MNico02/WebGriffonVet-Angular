export interface alergia{
    id_alergia: number;
    nombre:string;
}
export interface alergiaMascotaRequest{
    id_usuario: number;
    id_mascota:number;
    id_alergia :number;
    severidad :string; //la severidad solo puede ser leve, media, alta
    observaciones:string;
}