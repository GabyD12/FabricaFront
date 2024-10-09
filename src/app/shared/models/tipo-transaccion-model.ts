import { TransaccionModel } from "./transaccion-model";

export interface TipoTransaccionModel {
    id:number;
    TipoTransaccion:string;
    transacciones?:TransaccionModel[];
}
