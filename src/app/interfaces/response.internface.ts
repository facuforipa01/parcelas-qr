import { ParcelaI } from "./parcela.interface";

export interface ResponseI<T =any> {
    ok: boolean;
    result:T;
    msg: string;
  }