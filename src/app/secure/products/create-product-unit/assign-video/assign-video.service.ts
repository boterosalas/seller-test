import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssignVideoService {

  constructor(
    private http: HttpClient,
    private api: EndpointService
) {

}
  // Servicio para verificar si el Video es valido o no.
  getvalidateVideo(validateVideo: any): Observable<any> {
      return this.http.patch(this.api.get('validateVideo'), {UrlImage:validateVideo});
  }

}
