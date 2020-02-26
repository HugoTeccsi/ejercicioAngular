import { IDistrito } from './Distrito';

export interface IProvincia{
    codigo: string;
    descripcion: string;
    distritos?: Array<IDistrito>;
}