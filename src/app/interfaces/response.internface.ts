import { ParcelaI } from "./parcela.interface";

export interface ResponseI {
    ok: boolean;
    parcelas: {
      data: ParcelaI[];
      total: number;
      page: number;
      limit: number;
    };
    msg: string;
  }