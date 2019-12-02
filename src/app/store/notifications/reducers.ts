import { Types, ActionsUnion } from './actions';
import { NotificationState } from './state';

export const initialState: NotificationState = {
  unreadCases: 0,
  sumaUnreadDevolutions: 0,
  unreadDevolutions: 0,
  unreadPendings: 0
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
    case Types.GetAllDevolutionsDone:
      return { ...state, sumaUnreadDevolutions: action.payload.totalDevoluciones + action.payload.totalPendientes, unreadDevolutions: action.payload.totalDevoluciones, unreadPendings: action.payload.totalPendientes };
    default:
      return state;
  }
}
