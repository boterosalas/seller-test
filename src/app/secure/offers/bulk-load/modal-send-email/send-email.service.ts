import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndpointService } from '@app/core';

@Injectable({
  providedIn: 'root'
})
export class SendEmailService {

  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) { }

  getModeration(data: any) {
    return this.http.get(this.api.get('sendOrderEmail', [data.idseller, data.email]), {observe: 'response'});
  }
}
