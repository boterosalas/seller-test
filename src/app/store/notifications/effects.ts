import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, exhaustMap, switchMap, flatMap, filter } from 'rxjs/operators';
import * as NotificationActions from './actions';
import { of, interval, merge } from 'rxjs';

import { SellerSupportCenterService } from '../../secure/seller-support-center/services/seller-support-center.service';
import { AuthService } from '@app/secure/auth/auth.routing';

@Injectable()
export class NotificationEffects {
  @Effect()
  runNotificationDaemon = this.actions.pipe(
    ofType(NotificationActions.Types.RunNotificationDaemon),
    switchMap(() => interval(30000)),
    map(() => new NotificationActions.FetchUnreadCase())
  );

  @Effect()
  fetchUnreadCase = this.actions.pipe(
    ofType(NotificationActions.Types.FetchUnreadCase),
    flatMap(() => this.authService.getModules()),
    filter((modules: Array<any>) => {
      const moduleFounded = modules.filter(
        mod => mod.NameModule === 'RECLAMACIONES' && mod.ShowModule
      );
      return moduleFounded.length > 0;
    }),
    exhaustMap(() => this.sellerSupportService.getUnreadCase()),
    map(res => res.data),
    map((data: number) => new NotificationActions.FetchUnreadCaseDone(data))
  );

  constructor(
    private actions: Actions,
    private sellerSupportService: SellerSupportCenterService,
    public authService: AuthService
  ) {}
}
