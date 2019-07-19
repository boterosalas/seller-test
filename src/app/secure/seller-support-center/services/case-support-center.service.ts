import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {SellerSupportCenterService} from './seller-support-center.service';

@Injectable({
  providedIn: 'root'
})
export class CaseSupportCenterService {

  constructor(_http: HttpClient,
    private sellerSupportCenterService: SellerSupportCenterService) { }

  public markAsRead(id: string){
    const result = this.sellerSupportCenterService.patchReadCase(id)
    return result;
  }

}
