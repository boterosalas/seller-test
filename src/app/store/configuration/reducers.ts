import { Types, ActionsUnion } from './actions';
import { ConfigurationState } from './state';

export const initialState: ConfigurationState = {
  language: 'ES',
  statusCases: new Array<any>(),
};

export function configurationReducer(
  state: ConfigurationState = initialState,
  action: ActionsUnion
) {
  switch (action.type) {
    case Types.SetLanguage:
      return { ...state, language: action.payload };
    case Types.FetchStatusCasesDone:
      return { ...state, statusCases: action.payload };
    default:
      return state;
  }
}
