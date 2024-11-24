import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError } from "rxjs";

@Injectable({ providedIn: 'root' })

export class IngresoParcelaService {
    //constructor(private readonly http: HttpClient) {}
    private readonly http = inject(HttpClient);
    // URL de nuestra API Rest
    private readonly url = 'https://ghdh3ltt-3000.brs.devtunnels.ms/api';

    ingresar(usuarioId: string, parcelaId: string) {
        console.log(usuarioId, parcelaId)
        const direction = this.url + '/ingresos/entrada';
        console.log(direction)
        return this.http.post(direction, { usuarioId, parcelaId })
        .pipe(
            catchError((e) => {
                console.log(e);
                throw new Error(e)
            }),
        )     
    }
    salir(usuarioId: string, parcelaId: string, ingresoId:number) {
        console.log(usuarioId, parcelaId, ingresoId)
        const direction = this.url + '/ingresos/salida';
        console.log(direction)
        return this.http.post(direction, { usuarioId, parcelaId, ingresoId })
        .pipe(
            catchError((e) => {
                console.log(e);
                throw new Error(e)
            }),
        )     
    }

}

