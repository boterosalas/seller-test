import { Action } from '@ngrx/store';

const NAMESPACE = 'NOTIFICATION';
const withNamespace = (action: String) => `${NAMESPACE} - ${action}`;

// Action Types
export const Types = {
  FetchUnreadCase: withNamespace('Fetch unread case'),
  FetchUnreadCaseDone: withNamespace('Fetch unread case done'),
  RunNotificationDaemon: withNamespace('Run Notification Deamon'),
  FinishNotifications: withNamespace('Finish notifications'),
  StartNotifications: withNamespace('Start notifications')
};

export class FetchUnreadCase implements Action {
  readonly type = Types.FetchUnreadCase;
  constructor(public payload?: any) {}
}

export class FetchUnreadCaseDone implements Action {
  readonly type = Types.FetchUnreadCaseDone;
  constructor(public payload: number) {}
}

export class FinishNotifications implements Action {
  readonly type = Types.FinishNotifications;
  constructor(public payload?: any) {}
}

export class RunNotificationDaemon implements Action {
  readonly type = Types.RunNotificationDaemon;
  constructor(public payload?: any) {}
}

export class StartNotifications implements Action {
  readonly type = Types.StartNotifications;
  constructor(public payload?: any) {}
}

export type ActionsUnion = FetchUnreadCase;
