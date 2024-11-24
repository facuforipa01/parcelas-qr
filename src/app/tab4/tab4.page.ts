import { Component } from "@angular/core";
import { Geolocation } from "@capacitor/geolocation";

@Component({
    selector: 'app-tab4',
    templateUrl: './tab4.page.html'

})

export class Tab4Page {

    parcelas = [
        {
            "id": 1,
            "nome": "Parcela 1",
            "lat": -34.003333,
            "long": -58.0404,
        }
    ]

    mensaje = '';
    codigoParcela = '';
    posicionActual: {lat: number, long: number } | null = null;

    constructor() { }

    async obtenerUbicacionActual() {
        try {
            const position = await Geolocation.getCurrentPosition()
            this.posicionActual = {
                lat: position.coords.latitude,
                long: position.coords.longitude
            };
            console.log(this.posicionActual);
            this.mensaje = 'Ubicación actual: ' + this.posicionActual.lat +','+ this.posicionActual.long;
            } catch (error) {
                console.log('Error al obtener la ubicación:', error);
        }
    }
}