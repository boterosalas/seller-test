import { Injectable } from "@angular/core";
import { EndpointService } from "@app/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class SellerSupportCenterService {
  constructor(private _http: HttpClient, private _api: EndpointService) {}

  public getAllStatusCase(): Observable<StatusResponse> {
    const URL = this._api.get("getAllStatusCase");
    return this._http.get<StatusResponse>(URL);
  }

  public getAllCase(filter?: Filter): any {
    const URL = this._api.get("getAllCase");
    return this._http.post(URL, filter);
  }
}

export interface Filter {
  CaseNumber?: string;
  OrderNumber?: string;
  ReasonPQR?: string;
  Status?: Array<number>;
  DateInit?: string; //   dd/mm/yyyy
  DateEnd?: string; //   dd/mm/yyyy
  Page: number;
  PageSize: number;
}

export interface StatusResponse {
  errors: Array<any>;
  data: Array<Status>;
  message: string;
}

export interface Status {
  id: number;
  code: number;
  name: string;
  description: string;
  default: boolean;
  active: boolean;
  createDate: string;
  updateDate: string;
}

export interface CaseResponse {
  errors: Array<any>;
  data: {
    totalPages: number;
    page: number;
    pageSize: number;
    cases: Array<Case>;
  };
  message: string;
}

export interface Case {
  id: string;
  sellerId: string;
  caseId: string;
  status: number;
  orderNumber: string;
  reasonPQR: string;
  reasonDetail: string;
  description: string;
  createDate: string;
  updateDate: string;
  customerEmail: string;
  read: boolean;
  followLast: Array<any>;
}
