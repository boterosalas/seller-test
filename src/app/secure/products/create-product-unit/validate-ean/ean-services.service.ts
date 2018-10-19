import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EanServicesService {

  constructor(private http: HttpClient) {

   }

   validateEan(codigoEan: any) {
    const url = 'https://g5a9j4ahbd.execute-api.us-east-1.amazonaws.com/Products/' + codigoEan;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8'
      });
      return this.http.get(url, { headers: headers });
    }
}
