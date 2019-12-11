import { Action } from '@ngrx/store';
import { Status } from '@app/secure/seller-support-center/models/status';

const NAMESPACE = 'CONFIGURATION';
const withNamespace = (action: any) => `${NAMESPACE} - ${action}`;

export const Types = {
  ChangeLanguage: withNamespace('Change lenguage'),
  SetLanguage: withNamespace('Set lenguage'),
  FetchStatusCases: withNamespace('Fetch state traductions'),
  FetchStatusCasesDone: withNamespace('Fetch state traductions done')
};

export class ChangeLanguage implements Action {
  readonly type = Types.ChangeLanguage;
  constructor(public payload: string) { }
}

export class SetLanguage implements Action {
  readonly type = Types.SetLanguage;
  constructor(public payload: string) { }
}

export class FetchStatusCases implements Action {
  readonly type = Types.FetchStatusCases;
  constructor() { }
}

export class FetchStatusCasesDone implements Action {
  readonly type = Types.FetchStatusCasesDone;
  constructor(public payload: Array<Status>) { }
}

class GenericAction implements Action {
  readonly type = withNamespace('GENERIC');
  constructor(public payload: any) { }
}

export type ActionsUnion = GenericAction;
