import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { EndpointService } from "@app/core";
import { Observable } from "rxjs";


@Injectable({
  providedIn: "root",
})
export class UploadFileMasiveService {
  constructor(private http: HttpClient, private api: EndpointService) {}
  /**
   * funcion para subir un archivo
   *
   * @param {string} endPoint
   * @param {string} method
   * @param {*} body
   * @returns {Observable<any>}
   * @memberof UploadFileMasiveService
   */
  uploadFile(endPoint: string, method: string, body: any): Observable<any> {
    return this.http[method](this.api.get(endPoint), body);
  }
  /**
   * funcion para verificar el status de una carga masiva
   *
   * @param {string} endPoint
   * @param {string} method
   * @returns {Observable<any>}
   * @memberof UploadFileMasiveService
   */
  status(endPoint: string, method: string): Observable<any> {
    return this.http[method](this.api.get(endPoint));
  }
}
