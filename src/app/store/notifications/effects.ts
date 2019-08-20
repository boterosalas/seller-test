import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, exhaustMap } from 'rxjs/operators';
import * as NotificationActions from './actions';
import { of } from 'rxjs';

import { SellerSupportCenterService } from '../../secure/seller-support-center/services/seller-support-center.service';

@Injectable()
export class NotificationEffects {
  @Effect()
  fetchUnreadCase = this.actions.pipe(
    ofType(NotificationActions.Types.FetchUnreadCase),
    exhaustMap(() => this.sellerSupportService.getUnreadCase()),
    map(res => res.data),
    map((data: number) => new NotificationActions.FetchUnreadCaseDone(data))
  );

  constructor(
    private actions: Actions,
    private sellerSupportService: SellerSupportCenterService
  ) {}
}
