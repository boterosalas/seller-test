import { Types, ActionsUnion } from './actions';
import { NotificationState } from './state';

export const initialState: NotificationState = {
  unreadCases: 0
};

export function notificationReducer(
  state: NotificationState = initialState,
  action: ActionsUnion
) {
  switch (action.type) {
    case Types.FinishNotifications:
      return { ...initialState };
    case Types.FetchUnreadCaseDone:
      return { ...state, unreadCases: action.payload };
    default:
      return state;
  }
}
