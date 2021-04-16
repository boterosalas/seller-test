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

  createUpdateMassiveCategories(body: any): Observable<any> {
    return this.http.post(this.api.get('createUpdateMassiveCategories'), body);
  }
}
