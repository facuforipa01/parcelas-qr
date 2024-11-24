import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { catchError, map, Observable, tap } from 'rxjs';
import { ResponseI } from 'src/app/interfaces/response.internface';
import { TOKEN } from '../constants/service-key';
import { Router } from '@angular/router';



export interface LoginResponse {
    token: string;
    usuario: UsuarioD;
}

export interface UserI {
    email: string;
    password: string;
    token: string;
}

export interface UsuarioD {
    id: number;
    usuario: string;
    nombre: string;
    apellido: string;
    dni: number;
    competencia: string;
    fecha_nacimiento: Date;
    password: string;
    push_token: string;
    email: string;
    telefono: number;
    localidad: string;
    prefered_language: string;
    activo: number;
    fecha_hora_carga: Date;
    imagen_perfil: string;
    superadmin: number;
}

@Injectable({ providedIn: 'root' })
export class LoginService {

    //constructor(private readonly http: HttpClient) {}
    private readonly http = inject(HttpClient);
    // URL de nuestra API Rest
    private readonly url = 'https://ghdh3ltt-3000.brs.devtunnels.ms/api';

    login(email: string, password: string) {
        console.log(email,password)
        const direction = this.url + '/usuarios/auth/login';
        return this.http
            .post<ResponseI<string>>(direction, {
                email,
                password,
            })
            .pipe(
                catchError((e) => {
                    console.log(e);
                    throw new Error(e)
                }),
                tap((data) => this.saveTokenInCookies(data)),
                map((data) => data.result)
            );
    }

    private readonly cookieService = inject(CookieService);
    saveTokenInCookies(data: ResponseI<string>): void {
        console.log(data)
        console.log(data.msg)
        localStorage.setItem('userid', data.msg)
        this.cookieService.set(TOKEN, data.result, undefined, '/')
    }

    removeTokenInCookies() {
        this.cookieService.set(TOKEN, '', undefined, '/')
    }

    private readonly router = inject(Router);
    /** @description Todas las funciones para borrar las credenciales del usuario al desloguearse */
    logout() {
        this.removeTokenInCookies();
        this.router.navigate(['login'], { replaceUrl: true });

    }
}