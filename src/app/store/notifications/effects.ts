import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, exhaustMap, switchMap } from 'rxjs/operators';
import * as NotificationActions from './actions';
import { of, interval } from 'rxjs';

import { SellerSupportCenterService } from '../../secure/seller-support-center/services/seller-support-center.service';

@Injectable()
export class NotificationEffects {
  @Effect()
  runNotificationDaemon = this.actions.pipe(
    ofType(NotificationActions.Types.RunNotificationDaemon),
    switchMap(() => interval(5000)),
    map(() => new NotificationActions.FetchUnreadCase())
  );

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
