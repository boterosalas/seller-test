import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';

import * as ConfigurationActions from './actions';
import { switchMap, map, exhaustMap } from 'rxjs/operators';
import { SellerSupportCenterService } from '@app/secure/seller-support-center/services/seller-support-center.service';
import { Observable } from 'rxjs';
import { StatusResponse } from '@app/secure/seller-support-center/models/statusResponse';
import { Status } from '@app/secure/seller-support-center/models/status';

@Injectable()
export class ConfigurationEffects {

  @Effect()
  ChangeLanguage = this.actions.pipe(
    ofType(ConfigurationActions.Types.ChangeLanguage),
    map((action: ConfigurationActions.ChangeLanguage) => action.payload),
    switchMap((language: string) => {
      return [
        new ConfigurationActions.SetLanguage(language),
        new ConfigurationActions.FetchStatusCases()
      ];
    })
  );

  @Effect()
  FetchStateTraductions = this.actions.pipe(
    ofType(ConfigurationActions.Types.FetchStatusCases),
    exhaustMap((): Observable<StatusResponse> => this.sellerSupportService.getAllStatusCase()),
    map((statusResponse: StatusResponse) => {
      return statusResponse.data;
    }),
    map((status: Array<Status>): any => {
      return new ConfigurationActions.FetchStatusCasesDone(status);
    })
  );

  constructor(
    private actions: Actions,
    private sellerSupportService: SellerSupportCenterService
  ) { }
}
