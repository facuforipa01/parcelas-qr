import { Component, inject } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { IngresoParcelaService } from '../core/services/ingreso-parcela.service';
import { GeolocationService } from '../core/services/geolocation.service';
import { apiService } from '../api.service';
import { float } from '@zxing/library/esm/customTypings';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  code: string = '';
  usuario: string = '';
  ingreso: number = 0;
  ubiActual: { lat: number, long: number } | null = null;
  ubiParcela: { lat: number, long: number } | null = null;
  userlong: float = 0;
  ubicar!: Boolean;

  constructor() { }

  private readonly ingresoParcelaService = inject(IngresoParcelaService)
  private readonly geolocationService = inject(GeolocationService)
  private readonly apiService = inject(apiService)

  async scanQRCode() {
    // Wait for the location to be fetched
    await this.obtenerUbicacionActual();
  
    const status = await BarcodeScanner.checkPermission({ force: true });
  
    if (status.granted) {
      await BarcodeScanner.hideBackground(); // Hide the background for scanning.
  
      try {
        const result = await BarcodeScanner.startScan();
  
        if (result.hasContent) {
          this.code = result.content;
          localStorage.setItem('code', this.code);
          console.log('Scanned content:', result.content);
  
          // Process the scanned code
          this.obtenerUbicacionParcelas(this.code); // Ensure it completes before moving on
          
          setTimeout(() => {
            this.compararUbicaciones(); // Ensure locations comparison completes
            if (this.ubicar === true) {
              this.ingresarParcela();
              alert('Ingresaste a la parcela')
            } else {
              alert('Estas muy lejos de la parcela')
            }
          }, 900);
  
          // Check `this.ubicar` after all async operations

        } else {
          alert('No QR code found');
        }
      } catch (err) {
        console.log('Error scanning QR code:', err);
        alert('Error scanning QR');
      } finally {
        await BarcodeScanner.showBackground(); // Restore the background after scanning.
      }
    } else {
      alert('Camera permission denied');
    }
  }
  

  async scanQRCodeSalida() {
    
    const status = await BarcodeScanner.checkPermission({ force: true });

    if (status.granted) {
      await BarcodeScanner.hideBackground(); // Oculta el fondo de la aplicación para que la cámara sea visible.

      try {
        const result = await BarcodeScanner.startScan();
        if (result.hasContent) {
          this.code = result.content;
          console.log('Scanned content:', result.content);
          localStorage.setItem('code', '')
          //alert('Scanned QR Code: ' + result.content);
          this.salirParcela()
        } else {
          alert('No QR code found');
        }
      } catch (err) {
        console.log('Error scanning QR code:', err);
        alert('Error scanning QR');
      } finally {
        await BarcodeScanner.showBackground(); // Restaura el fondo después del escaneo.
      }
    } else {
      alert('Camera permission denied');
    }
  }

  ngOnInit() {
    const usuariodeLocal = localStorage.getItem('userid')!;
    this.usuario = usuariodeLocal;
    const ingresodeLocal = JSON.parse(localStorage.getItem('ingreso')!);
    this.ingreso = ingresodeLocal.result.id;
    const codedeLocal = localStorage.getItem('code')!;
    this.code = codedeLocal;
    const ubideLocal = JSON.parse(localStorage.getItem('ubi')!);
    this.ubiParcela = ubideLocal;
    const ubiActualdeLocal = JSON.parse(localStorage.getItem('ubi')!);
    this.ubiActual = ubiActualdeLocal;
    this.geolocationService.obtenerUbicacionActual()
  }

  ingresarParcela() {
    this.ingresoParcelaService.ingresar(this.usuario, this.code)
      .subscribe({
        next: (response) => {
          console.log('Respuesta del backend:', response);
          const ingreso = JSON.stringify(response)
          localStorage.setItem('ingreso', ingreso);
          this.ngOnInit()
        },
        error: () => {
          alert(`Parcela Nro ${this.code} ocupada`);
        }
      });
  }
  salirParcela() {
    this.ingresoParcelaService.salir(this.code, this.usuario, this.ingreso)
      .subscribe({
        next: (response) => {
          console.log('Respuesta del backend:', response);
          localStorage.setItem('ingreso', "0");
          this.ngOnInit()
        },
        error: () => {
          alert(`hubo un error al salir`);
        }
      });
  }

  obtenerUbicacionParcelas(code: string) {
    this.apiService.getParcelaById(code).subscribe({
      next: (response) => {
        this.ubiParcela = {
          lat: parseFloat(response.result.lat),
          long: parseFloat(response.result.long)
        };
        console.log(this.ubiParcela)
      },
      error: () => {
        alert(`hubo un error al salir`);
      }
    });
  }

  obtenerUbicacionActual() {
    this.geolocationService.obtenerUbicacionActual()
    this.ubiActual = {
      lat: parseFloat(localStorage.getItem('userlat') || "0"),
      long: parseFloat(localStorage.getItem('userlong') || "0")
    };
    this.ubiActual.lat = parseFloat(this.ubiActual?.lat.toFixed(3))
    this.ubiActual.long = parseFloat(this.ubiActual?.long.toFixed(3))
  }

  compararUbicaciones() {

    if (
      this.ubiActual?.lat !== undefined &&
      this.ubiParcela?.lat !== undefined &&
      this.ubiActual?.long !== undefined &&
      this.ubiParcela?.long !== undefined &&
      Math.abs(this.ubiActual?.lat - this.ubiParcela?.lat) < 0.100 &&
      Math.abs(this.ubiActual?.long - this.ubiParcela?.long) < 0.100
    ) {
      console.log('aca devuelve true')
      this.ubicar = true
    }
    else {
      console.log('Aca devuelve false')
      this.ubicar = false
    }
  }




}
