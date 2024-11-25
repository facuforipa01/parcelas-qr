import { Injectable } from "@angular/core";
import { Geolocation } from "@capacitor/geolocation";

@Injectable({providedIn: 'root'})

export class GeolocationService{

    codigoParcela = '';
    posicionActual: {lat: number, long: number } | null = null;
    
    async obtenerUbicacionActual(){
        try {
            const position = await Geolocation.getCurrentPosition()
            this.posicionActual = {
                lat: position.coords.latitude,
                long: position.coords.longitude
            };

            localStorage.setItem('userlat', JSON.stringify(this.posicionActual.lat))
            localStorage.setItem('userlong', JSON.stringify(this.posicionActual.long))

            } catch (error) {
                console.log('Error al obtener la ubicación:', error);
        }
    }

}