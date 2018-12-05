import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { EndpointService } from '@app/core';
import { Observable } from 'rxjs';


@Injectable()
export class SendModerationFormatModalService {

  constructor(
    private http: HttpClient,
    private api: EndpointService,
    private snackBar: MatSnackBar
  ) {
  }

  /**
   * Enviar la moderación al correo especificado.
   *
   * @param {string} mail
   * @returns {Observable<HttpResponse<Object>>}
   */
  getModeration(data: { email: string }) {
    const request = this.http.get(this.api.get('productModeration', [data.email]), {observe: 'response'});
    request.subscribe(res => {
      let message;
      if (res.status === 200) {
        message = 'Se ha enviado correctamente la moderación.';
      } else {
        message = 'Algo ocurrió, no se pudo enviar la moderación.';
      }
      this.snackBar.open(message, 'Cerrar', {
        duration: 3000
      });
    });
    return request;
  }

  sendModeration(data: any): Observable<any> {
    return this.http.patch(this.api.get('productModeration'), data);
  }


}
