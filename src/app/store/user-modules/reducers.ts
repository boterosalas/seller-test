import { Types, ActionsUnion } from './actions';
import { UserModulesState } from './state';

export const initialState: UserModulesState = {
  modules: null
};

export function userModulesReducer(
  state: UserModulesState = initialState,
  action: ActionsUnion
): UserModulesState {
  switch (action.type) {
    case Types.FetchModulesDone:
      return { ...state, modules: action.payload };
    default:
      return state;
  }
}
