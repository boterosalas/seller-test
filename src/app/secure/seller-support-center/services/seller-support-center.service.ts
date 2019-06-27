import { Injectable } from "@angular/core";
import { EndpointService } from "@app/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { Filter } from "../models/filter";
import { CaseListResponse } from "../models/case-list-response.model";
import { StatusResponse } from "../models/statusResponse";
import { CaseDetailResponse } from "../models/case-detail-response.model";

@Injectable({
  providedIn: "root"
})
export class SellerSupportCenterService {
  constructor(private _http: HttpClient, private _api: EndpointService) {}

  public getAllStatusCase(): Observable<StatusResponse> {
    const URL = this._api.get("getAllStatusCase");
    return this._http.get<any>(URL);
  }

  public getAllCase(filter?: Filter): Observable<CaseListResponse> {
    const URL = this._api.get("getAllCase");
    return this._http.post<CaseListResponse>(URL, filter);
  }

  public getCase(id: string): Observable<CaseDetailResponse> {
    const URL = this._api.get("getCase");
    return this._http.get<CaseDetailResponse>(URL + `/${id}`);
  }

  public getListHeaderConfiguration(): any {
    return require("../configurations/configuration-list-header.json");
  }
}
