import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, exhaustMap, switchMap } from 'rxjs/operators';
import { interval } from 'rxjs';

import * as NotificationActions from './actions';
import { SellerSupportCenterService } from '../../secure/seller-support-center/services/seller-support-center.service';

@Injectable()
export class NotificationEffects {
  @Effect()
  startNotifications = this.actions.pipe(
    ofType(NotificationActions.Types.StartNotifications),
    switchMap(() => [
      new NotificationActions.FetchUnreadCase(),
      new NotificationActions.RunNotificationDaemon()
    ])
  );

  @Effect()
  runNotificationDaemon = this.actions.pipe(
    ofType(NotificationActions.Types.RunNotificationDaemon),
    switchMap(() => interval(300000)),
    map(() => new NotificationActions.FetchUnreadCase())
  );

  @Effect()
  fetchUnreadCase = this.actions.pipe(
    ofType(NotificationActions.Types.FetchUnreadCase),
    exhaustMap(() => this.sellerSupportService.getUnreadCase()),
    map(res => res.data),
    map((data: number) => new NotificationActions.FetchUnreadCaseDone(data))
  );

  @Effect()
  getUnreadDevolution = this.actions.pipe(
    ofType(NotificationActions.Types.GetAllDevolutions),
    switchMap(() => this.sellerSupportService.getPendingDevolutions().pipe(
      map(res => res.data),
      map((data: number) => {
        return new NotificationActions.GetAllDevolutionsDone(data);
      }))),
  );

  constructor(
    private actions: Actions,
    private sellerSupportService: SellerSupportCenterService
  ) { }
}
