import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EanServicesService {

  constructor(private http: HttpClient) {

   }

   validateEan() {
    const url = 'https://jsonplaceholder.typicode.com/posts';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8'
      });
      return this.http.post(url, { headers: headers });
    }
}
