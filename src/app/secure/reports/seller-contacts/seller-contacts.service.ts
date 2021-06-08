import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SellerContactsService {

  constructor(private http: HttpClient, private api: EndpointService) { }


  public sendEmailExportContacts(body: any): Observable<any> {
    return this.http.patch(this.api.get('exportContacts'), body);
  }

  
   public getListContacts(): Observable<any> {
    return this.http.get(this.api.get('listContacts'));
  }

  
}
