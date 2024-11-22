import { Component } from '@angular/core';
import { apiService } from '../api.service';
import { ParcelaI } from '../interfaces/parcela.interface';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
  
})
export class Tab1Page {
  parcela: ParcelaI[] = [];
  constructor(private apiService: apiService) {}

  ngOnInit(): void {
    this.apiService.getAllParcelas().subscribe({
      next: (response) => {
        if (response.ok) {
          console.log(response)
          this.parcela = response.result.data
        } else {
          console.error('Error en la respuesta:', response.msg);
        }
      },
      error: (err) => {
        console.error('Error al obtener reservas:', err);
      },
    });
  }
}
