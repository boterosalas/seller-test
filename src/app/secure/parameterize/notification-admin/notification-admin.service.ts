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

  /**
   * funcion para listar todas las notificaciones
   *
   * @param {*} params
   * @returns {Observable<any>}
   * @memberof NotificationAdminService
   */
  getAllNotification(params: any): Observable<any> {
    return this.http.get(`${this.api.get('getAllNotification', [params])}`, { observe: 'response' });
  }
  /**
   * funcion para crear un nuevo anuncio
   *
   * @param {*} body
   * @returns {Observable<any>}
   * @memberof NotificationAdminService
   */
  public createNew(body: any): Observable<any> {
    return this.http.post(this.api.get('createNew'), body);
  }
  /**
   * funcion para guardar imagen en el s3 devuelve una url
   *
   * @param {*} body
   * @returns {Observable<any>}
   * @memberof NotificationAdminService
   */
  public saveImgNotification(body: any): Observable<any> {
    return this.http.post(this.api.get('saveImgNotification'), body, { observe: 'response' });
  }
  /**
   * funcion para actualizar registro de los anuncios
   *
   * @param {*} body
   * @returns {Observable<any>}
   * @memberof NotificationAdminService
   */
  public updateNotification(body: any): Observable<any> {
    return this.http.patch(this.api.get('updateNotification'), body);
  }
  /**
   * funcion para borrar notificaciones
   *
   * @param {*} id
   * @returns {Observable<any>}
   * @memberof NotificationAdminService
   */
  public deleteNotification(id: any): Observable<any> {
    return this.http.delete(this.api.get('deleteNotification', [id]));
  }

}
