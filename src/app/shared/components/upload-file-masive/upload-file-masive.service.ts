import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndpointService } from '@app/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadFileMasiveService {

  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) { }

  uploadFile(endPoint: string, method: string , body: any): Observable<any> {
    return this.http[method](this.api.get(endPoint), body);
  }

  status(endPoint: string, method: string): Observable<any> {
    return this.http[method](this.api.get(endPoint));
  }
}
