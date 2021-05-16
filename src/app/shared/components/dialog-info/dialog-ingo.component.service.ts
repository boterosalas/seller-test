import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, Output } from '@angular/core';
import { CognitoUtil, EndpointService } from '@app/core';
import { Observable, of } from 'rxjs';
import { EventEmitter } from '@angular/core';


@Injectable()
export class ListModalService {
  public headers: any;
  @Output() change: EventEmitter<boolean> = new EventEmitter();


  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) {
  }

  /**
   * Servkicio para eliminar poroductos vendedor
   * @param {*} body
   * @returns {Observable<any>}
   * @memberof ListProductService
   */
  public servicePatch(name: string, body: any): Observable<any> {
    return this.http.patch(this.api.get(name), body);
    // return this.http[name](name, body);
  }


}
