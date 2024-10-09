import { TipoTransaccionModel } from "./tipo-transaccion-model";

export interface TransaccionModel {
    id:number;
    Motivo:string;
    fecha:string;
    Monto:number;
    id_tipo_transaccion:number;
    tipo_transaccion?:TipoTransaccionModel;
}
