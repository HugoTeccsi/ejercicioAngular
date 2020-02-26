import { IProvincia } from './Provincia';

export interface IDepartamento{
    codigo: string;
    descripcion: string;
    provincias?: Array<IProvincia>;
}