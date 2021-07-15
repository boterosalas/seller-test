import { HttpClient } from "@angular/common/http";
import { Injectable, Output } from "@angular/core";
import { EndpointService } from "@app/core";
import { Order } from "@app/shared";
import { Observable } from "rxjs/Observable";
import { EventEmitter } from "@angular/core";

@Injectable()
/**
 * Clase OrderService
 */
export class PendingProductsService {
  @Output() change: EventEmitter<boolean> = new EventEmitter();

  constructor(private http: HttpClient, private api: EndpointService) {}

  public changeEmitter(): void {
    this.change.emit(false); // Todo el que este subscrito a esta variable va a obtener el cambio de la misma
  }

  /**
   * Método para realiar la consulta de los productos pendientes por modificación.
   * @param {any} state
   * @param {User} user
   * @param {any} limit
   * @returns {Observable<[{}]>}
   * @memberof OrderService
   */
  getPendingProductsModify(params: any): Observable<[{}]> {
    const filter = "";
    return new Observable((observer) => {
      this.http
        .get<Order[]>(
          this.api.get("getProductsPendingModify", [
            params.idSeller,
            params.limit + filter,
          ])
        )
        .subscribe(
          (data: any) => {
            observer.next(data);
          },
          (err) => {
            observer.error(err);
          }
        );
    });
  }

  /**
   * Método para realiar la consulta de los productos pendientes por validación.
   * @param {*} params
   * @returns {Observable<[{}]>}
   * @memberof PendingProductsService
   */
  getPendingProductsValidation(params: any): Observable<[{}]> {
    const filter = "";
    return new Observable((observer) => {
      this.http
        .get<Order[]>(
          this.api.get("getProductsPendingValidation", [
            params.idSeller,
            params.limit + filter,
          ])
        )
        .subscribe(
          (data: any) => {
            observer.next(data);
          },
          (err) => {
            observer.error(err);
          }
        );
    });
  }

  /**
   * Obtener información al detalle del producto por EAN productos en modificacion
   * @param {*} params
   * @returns {Observable<[{}]>}
   * @memberof PendingProductsService
   */
  getEANProductsModify(params?: any): Observable<{}> {
    // return this.http.get(this.api.get('getProductList', [params]));
    return this.http.get(this.api.get("getEANPendingModify", [params]));
  }

  /**
   * Obtener información al detalle del producto por EAN para productos en validación
   * @param {*} [params]
   * @returns {Observable<{}>}
   * @memberof PendingProductsService
   */
  getEANProductsValidation(params?: any): Observable<{}> {
    // return this.http.get(this.api.get('getProductList', [params]));
    return this.http.get(this.api.get("getEANPendingValidation", [params]));
  }

  /**
   *Retorna todoas las categorias de los productos pendienentes de modificacion
   *
   * @returns {Observable<{}>}
   * @memberof PendingProductsService
   */
  getCategoriesToDownloadProductsPendingModification(): Observable<any> {
    return this.http.get(
      this.api.get("getCategoriesProductsPendingModification")
    );
  }

  /**
   *Hace el llamado para enviar el archivo zip al correo seleccionado
   *
   * @returns {Observable<{}>}
   * @memberof PendingProductsService
   */
  sendReportProductsPendingModification(params?: any): Observable<any> {
    return this.http.get(
      this.api.get("reportProductsPendingModificartion", [
        params.email,
        params.categories,
      ])
    );
  }
}
