import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndpointService } from '@app/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationAdminService {


  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) { }


  getAllNotification(params: any): Observable<any>  {
    return this.http.get(`${this.api.get('getAllNotification', [params])}`, { observe: 'response' });
  }
  /**
   * funcion para salvar un puerto registrado
   *
   * @param {*} params
   * @returns
   * @memberof PortCollectionService
   */
   public createNew(body: any): Observable<any> {
    return this.http.post(this.api.get('createNew'), body);
  }

   public saveImgNotification(body: any): Observable<any> {
    return this.http.post(this.api.get('saveImgNotification'), body , { observe: 'response' });
  }

  public updateNotification(body: any): Observable<any> {
    return this.http.patch(this.api.get('updateNotification'), body);
  }

}
