import { Component } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
code:any
  constructor() {}

  async scanQRCode() {
    const status = await BarcodeScanner.checkPermission({ force: true });
  
    if (status.granted) {
      await BarcodeScanner.hideBackground(); // Oculta el fondo de la aplicación para que la cámara sea visible.
      
      try {
        const result = await BarcodeScanner.startScan();
        if (result.hasContent) {
          console.log('Scanned content:', result.content);
          alert('Scanned QR Code: ' + result.content);
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
  
}
