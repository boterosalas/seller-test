import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EndpointService } from "@app/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class ReportOrderService {
  constructor(private http: HttpClient, private api: EndpointService) {}

  /**
   * Retorna un respuesta con los errores si los hay, o con el envio exitoso del reporte
   * @param body
   * @returns
   */
  sendReportOrdersToEmail(body: any): Observable<any> {
    return this.http.post(this.api.get("reportOrders"), body);
  }
}
