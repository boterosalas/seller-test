import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { EndpointService } from '@app/core';
import { Observable } from 'rxjs';


@Injectable()
export class SendModerationFormatModalService {

  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) {
  }

  /**
   * Enviar la moderación al correo especificado.
   *
   * @param {string} mail
   * @returns {Observable<HttpResponse<Object>>}
   */
  getModeration(data: { email: string }) {
    return this.http.get(this.api.get('productModeration', [data.email]), {observe: 'response'});
  }

  sendModeration(data: any): Observable<any> {
    return this.http.patch(this.api.get('productModeration'), data);
  }


}
