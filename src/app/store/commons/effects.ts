import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, filter } from 'rxjs/operators';
import { UserModulesActions } from '../user-modules';
import { NotificationActions } from '../notifications';
import * as CommonActions from './actions';

// Commons effects
@Injectable()
export class CommonEffects {
  @Effect()
  startModules = this.actions.pipe(
    ofType(CommonActions.Types.StartModules),
    switchMap((action: CommonActions.StartModules) => [
      new UserModulesActions.FetchModulesDone(action.payload),
      new CommonActions.ActivateUnreadCaseNotification(action.payload)
    ])
  );

  @Effect()
  activateUnreadCaseNotification = this.actions.pipe(
    ofType(CommonActions.Types.ActivateUnreadCaseNotification),
    map((action: CommonActions.ActivateUnreadCaseNotification) =>
      action.payload.filter(
        userModule =>
          userModule.NameModule === 'RECLAMACIONES' && userModule.ShowModule
      )
    ),
    map((modules: Array<any>) =>
      modules.length > 0
        ? new NotificationActions.StartNotifications()
        : new NotificationActions.FinishNotifications()
    )
  );

  constructor(private actions: Actions) {}
}
