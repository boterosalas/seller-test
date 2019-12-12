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

import {
  ConfigurationActions,
  ConfigurationEffects,
  ConfigurationState,
  configurationReducer
} from './configuration';

export interface CoreState {
  notification: NotificationState;
  configuration: UserModulesState;
  appConfiguration: ConfigurationState;
}

export const CoreReducers: ActionReducerMap<CoreState> = {
  notification: notificationReducer,
  configuration: userModulesReducer,
  appConfiguration: configurationReducer
};

export const CoreActionTypes = [
  NotificationActions.Types,
  UserModulesActions.Types,
  ConfigurationActions.Types
];
