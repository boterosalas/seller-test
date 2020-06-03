import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndpointService } from '@app/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalExportReclaimService {

  constructor(private http: HttpClient, private api: EndpointService) { }


  public sendEmailExportReclaim(body: any): Observable<any> {
    // return this.http.post(this.api.get(''), body);
    return new Observable(observer => {
      observer.next(true);
    });
  }
}
