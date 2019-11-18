import { Action } from '@ngrx/store';

const NAMESPACE = 'COMMONS';
const withNamespace = (action: String) => `${NAMESPACE} - ${action}`;

export const Types = {
  StartModules: withNamespace('Start modules'),
  ActivateUnreadCaseNotification: withNamespace(
    'Activate Unread Case Notification'
  )
};

export class StartModules implements Action {
  readonly type = Types.StartModules;
  constructor(public payload?: any) {}
}

export class ActivateUnreadCaseNotification implements Action {
  readonly type = Types.ActivateUnreadCaseNotification;
  constructor(public payload?: Array<any>) {}
}
