/* @flow */
import * as Actions from '../actions';
import type {
  GetDiaryEntryListStartAction,
  GetDiaryEntryListSuccessAction,
  GetDiaryEntryListFailureAction,
  UnshiftDiaryEntryListAction,
  PushDiaryEntryListAction,
} from '../actions';

export type DiaryEntryState = {
  id: number,
  title: string,
  body: string,
  emoji: string,
  updatedAt: string,
  createdAt: string,
  user: {
    id: number,
    name: string,
    imageUrl: string,
    updateAt: string,
    createdAt: string,
  },
  diaryEntryImages: ?Array<{
    id: number,
    diaryEntryId: number,
    uri: string,
  }>,
};

export type DiaryEntryListState = {
  diaryEntries: Array<DiaryEntryState>,
  isLoading: boolean,
};

// reducer
export default (
  state: DiaryEntryListState = {
    diaryEntries: [],
    isLoading: false,
  },
  action:
    | GetDiaryEntryListStartAction
    | GetDiaryEntryListSuccessAction
    | GetDiaryEntryListFailureAction
    | UnshiftDiaryEntryListAction
    | PushDiaryEntryListAction,
): DiaryEntryListState => {
  switch (action.type) {
    case Actions.GET_DIARY_ENTRY_LIST_START:
      return Object.assign({}, state, { isLoading: true });
    case Actions.GET_DIARY_ENTRY_LIST_SUCCESS:
      return Object.assign({}, state, { isLoading: false });
    case Actions.GET_DIARY_ENTRY_LIST_FAILURE:
      return Object.assign({}, state, { isLoading: false });
    case Actions.UNSHIFT_DIARY_ENTRY_LIST:
      state.diaryEntries.unshift(...action.payload);
      return state;
    case Actions.PUSH_DIARY_ENTRY_LIST:
      state.diaryEntries.push(...action.payload);
      return state;
    default:
      return state;
  }
};
