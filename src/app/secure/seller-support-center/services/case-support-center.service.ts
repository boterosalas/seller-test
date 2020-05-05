import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SellerSupportCenterService } from './seller-support-center.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CaseSupportCenterService {
  sellerIdCase: any;
  constructor(
    _http: HttpClient,
    private router: Router,
    private sellerSupportCenterService: SellerSupportCenterService
  ) { }

  public markAsRead(id: string) {
    const result = this.sellerSupportCenterService.patchReadCase(id);
    return result;
  }

  /**
   * Servicio para redirigir al detalle de las reclamaciones
   * @param caseId Id del caso para el detalle de reclamación seleccionada
   * @param sellerId
   */
  redirectToDetailsServ(caseId: any, sellerId: any) {
    this.router.navigate(['/securehome/seller-center/detail/' + caseId]);
    this.sellerIdCase = sellerId;
  }

  /**
   * Servicio para redirigir al listado de las reclamaciones luego de abrir el detalle
   * @memberof CaseSupportCenterService
   */
  redirectToListServ() {
    this.router.navigate(['/securehome/seller-center/support-center/' + this.sellerIdCase]);
    this.sellerIdCase = '';
  }
}
