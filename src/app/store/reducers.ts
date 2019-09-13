import { ActionReducerMap } from '@ngrx/store';

import {
  NotificationActions,
  NotificationState,
  notificationReducer
} from './notifications';
import {
  UserModulesActions,
  UserModulesState,
  userModulesReducer
} from './user-modules';

export interface CoreState {
  notification: NotificationState;
  configuration: UserModulesState;
}

export const CoreReducers: ActionReducerMap<CoreState> = {
  notification: notificationReducer,
  configuration: userModulesReducer
};

export const CoreActionTypes = [
  NotificationActions.Types,
  UserModulesActions.Types
];
