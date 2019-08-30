import { ActionReducerMap } from '@ngrx/store';

import {
  NotificationActions,
  NotificationState,
  notificationReducer
} from './notifications';

export interface CoreState {
  notification: NotificationState;
}

export const CoreReducers: ActionReducerMap<CoreState> = {
  notification: notificationReducer
};

export const CoreActionTypes = [NotificationActions.Types];
