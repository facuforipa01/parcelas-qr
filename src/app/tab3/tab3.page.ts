import { Component, inject } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { IngresoParcelaService } from '../core/services/ingreso-parcela.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  code: string = '';
  usuario: string = '';

  constructor() { }

  private readonly ingresoParcelaService = inject(IngresoParcelaService)

  async scanQRCode() {
    const status = await BarcodeScanner.checkPermission({ force: true });

    if (status.granted) {
      await BarcodeScanner.hideBackground(); // Oculta el fondo de la aplicación para que la cámara sea visible.

      try {
        const result = await BarcodeScanner.startScan();
        if (result.hasContent) {
          this.code = result.content;
          console.log('Scanned content:', result.content);
          //alert('Scanned QR Code: ' + result.content);
          this.ingresarParcela()
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
    console.log(this.usuario)
  }

  ingresarParcela() {
    this.ingresoParcelaService.ingresar(this.usuario, this.code)
    .subscribe({
      next: (response) => {
          console.log('Respuesta del backend:', response);
      },
      error: (err) => {
          console.error('Error en la solicitud:', err);
      }
  });
  
  }

}
