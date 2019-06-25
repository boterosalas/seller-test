import { Injectable } from "@angular/core";
import { EndpointService } from "@app/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class SellerSupportCenterService {
  constructor(private _http: HttpClient, private _api: EndpointService) {}

  public getAllStatusCase() {
    const URL = this._api.get("getAllStatusCase");
    return this._http.get(URL);
  }
}
