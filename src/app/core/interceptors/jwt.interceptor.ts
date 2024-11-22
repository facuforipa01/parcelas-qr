import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { catchError, throwError } from 'rxjs';
import { TOKEN } from '../constants/service-key';
import { LoginService } from '../services/login.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
    // Omitir el interceptor si la solicitud es para la ruta de inicio de sesión
    if (req.url.includes('/login')) {
        return next(req); // Deja pasar la request sin modificar
    }

    const cookieService = inject(CookieService);
    const auth = inject(LoginService);
    const token = cookieService.get(TOKEN);

    if (token) {
        // Clonar el request para insertar el token
        const request = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`, // Nota: la cabecera es sensible a mayúsculas
            },
        });

        // Manejar errores con un pipe de observables
        return next(request).pipe(
            catchError((e) => {
                if (e instanceof HttpErrorResponse && e.status === 401) {
                    auth.logout();
                    return throwError(() => new Error('Unauthorized'));
                } else {
                    return throwError(() => new Error('Internal server error'));
                }
            })
        );
    } else {
        // Si no existe token, desloguear al usuario
        auth.logout();
        return throwError(() => new Error('No token provided'));
    }
};