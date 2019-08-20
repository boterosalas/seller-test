import { Action } from '@ngrx/store';

const NAMESPACE = 'NOTIFICATION - ';
const withNamespace = action => `${NAMESPACE} - ${action}`;

// Action Types
export const Types = {
  FetchUnreadCase: withNamespace('Fetch unread case'),
  FetchUnreadCaseDone: withNamespace('Fetch unread case done')
};

export class FetchUnreadCase implements Action {
  readonly type = Types.FetchUnreadCase;
  constructor(public payload?: any) {}
}

export class FetchUnreadCaseDone implements Action {
  readonly type = Types.FetchUnreadCaseDone;
  constructor(public payload?: number) {}
}

export type ActionsUnion = FetchUnreadCase;
