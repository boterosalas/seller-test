import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Observable } from 'rxjs/Observable';
import { ZoneModel } from '../dialogs/models/zone.model';
import { AnalysisSchemeStatus } from 'aws-sdk/clients/cloudsearch';


const dialogTypeZone = 2;

@Injectable()
export class ListZonesService {

  public zones: Array<any>;

  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) {
  }

  /**
   * Get all zones storage in database.
   * @method getListZones
   * @returns {Observable<{}>}
   * @memberof ListZonesService
   */
  getListZones(): Observable<{}> {
    return this.http.get(this.api.get('zones'), { observe: 'response' });
  }

  /**
   * Add zone
   * @param model
   */
  public addZone(model: ZoneModel[]): Observable<{}> {
    return this.http.patch<any>(this.api.get('zones'), model, { observe: 'response' });
  }

  /**
   * Update zone
   *
   * @param {ZoneModel[]} model
   * @returns {Observable<{}>}
   * @memberof ListZonesService
   */
  public updateZone(model: ZoneModel[]): Observable<{}> {
    return this.http.post<any>(this.api.get('zones'), model, { observe: 'response' });
  }

  /**
   * Delete a zone by identifier
   * Service to delete a zone data from a identifier param
   * @param idZone
   */
  public deleteZone(idZone: number): Observable<{}> {
    return this.http.delete<any>(this.api.get('getZone', [idZone]), { observe: 'response' });
  }

  /**
   * Get a zone by identifier.
   * Service to get a zone data from a identifier param
   * @param {number} idZone
   * @returns {Observable<{}>}
   * @memberof ListZonesService
   */
  public getZone(idZone: number): Observable<{}> {
    return this.http.get<any>(this.api.get('getZone', [idZone]), { observe: 'response' });
  }


  /**
   * Get const with a value of dialog type
   *
   * @returns {number}
   * @memberof ListTransporterService
   */
  getDialogType(): number {
    return dialogTypeZone;
  }
}
