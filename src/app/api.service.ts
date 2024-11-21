import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseI } from './interfaces/response.internface';


@Injectable({
  providedIn: 'root',
})
export class apiService  {
  
  private readonly url = 'https://ghdh3ltt-3000.brs.devtunnels.ms/';

  constructor(private http: HttpClient) { }

  getAllParcelas():Observable<ResponseI>{
    return this.http.get<ResponseI>(`${this.url}/parcelas`);
  }

}