import { Action } from '@ngrx/store';

const NAMESPACE = 'USER MODULES';
const withNamespace = (action: String) => `${NAMESPACE} - ${action}`;

export const Types = {
  FetchModulesDone: withNamespace('Fetch modules done')
};

export class FetchModulesDone implements Action {
  readonly type = Types.FetchModulesDone;
  constructor(public payload: Array<any>) {}
}

export type ActionsUnion = FetchModulesDone;
