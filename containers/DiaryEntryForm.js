/* @flow */
import { connect } from 'react-redux';
import { AsyncStorage } from 'react-native';
import DiaryEntryForm from '../components/DiaryEntryForm.js';
import ApiClient from '../api';
import * as Actions from '../actions';
import store from '../store';
import type { ReduxState } from '../reducers';

type navigationProps = {
  navigation: {
    navigate: (screenName: string) => void,
    goBack: () => void,
  },
};

export type DiaryEntryFormActions = {
  setDiaryEntryForm: number => Promise<any>,
  submitDiaryEntry: () => Promise<any>,
  resetForm: () => void,
  handleChangeTitle: (title: string) => void,
  handleChangeBody: (body: string) => void,
  handleChangeEmoji: (emoji: string) => void,
  handleChangeImage1: (image1: {
    uri: string,
    name: string,
    type: string,
  }) => void,
  handleChangeImage2: (image2: {
    uri: string,
    name: string,
    type: string,
  }) => void,
  handleChangeImage3: (image3: {
    uri: string,
    name: string,
    type: string,
  }) => void,
  deleteImage1: () => Promise<any>,
  deleteImage2: () => Promise<any>,
  deleteImage3: () => Promise<any>,
};

export default connect(
  (state: ReduxState) => ({
    diaryEntryForm: state.diaryEntryForm,
    diaryEntry: state.diaryEntry,
  }),
  (
    dispatch: Dispatch,
    ownProps: navigationProps,
  ): { actions: DiaryEntryFormActions } => ({
    actions: {
      resetForm: () => {
        dispatch(Actions.createDiaryEntrySuccess());
      },
      setDiaryEntryForm: async (id: number) => {
        const Api = new ApiClient(store.getState().sessionToken);
        const diaryEntry = await Api.getDiaryEntry(id);
        dispatch(
          Actions.handleChangeDiaryEntry({
            id: diaryEntry.id,
            title: diaryEntry.title,
            body: diaryEntry.body,
            emoji: diaryEntry.emoji,
            image1: diaryEntry.diaryEntryImages[0]
              ? {
                  id: diaryEntry.diaryEntryImages[0].id,
                  defaultUri: diaryEntry.diaryEntryImages[0].uri,
                }
              : null,
            image2: diaryEntry.diaryEntryImages[1]
              ? {
                  id: diaryEntry.diaryEntryImages[1].id,
                  defaultUri: diaryEntry.diaryEntryImages[1].uri,
                }
              : null,
            image3: diaryEntry.diaryEntryImages[2]
              ? {
                  id: diaryEntry.diaryEntryImages[2].id,
                  defaultUri: diaryEntry.diaryEntryImages[2].uri,
                }
              : null,
          }),
        );
      },
      submitDiaryEntry: async () => {
        const Api = new ApiClient(store.getState().sessionToken);
        const diaryEntryForm = store.getState().diaryEntryForm;
        const currentDiary = store.getState().currentDiary;
        const currentDiaryEntryList = store.getState().diaryEntryList;
        if (currentDiary === null) return;
        dispatch(Actions.createDiaryEntryStart());
        try {
          if (diaryEntryForm.id) {
            const diaryEntry = await Api.updateDiaryEntry(
              diaryEntryForm,
              diaryEntryForm.id,
            );
            dispatch(Actions.setDiaryEntry(diaryEntry));
          } else {
            await Api.createDiaryEntry(diaryEntryForm, currentDiary.id);
          }
          dispatch(Actions.createDiaryEntrySuccess());
          ownProps.navigation.goBack();
          const diaryEntryList = await Api.getMoreNewerDiaryEntries(
            currentDiary.id,
            currentDiaryEntryList.diaryEntries.length > 0
              ? currentDiaryEntryList.diaryEntries[0].id
              : 0,
          );
          // load first diary entry
          dispatch(Actions.unshiftDiaryEntryList(diaryEntryList.diaryEntries));
          dispatch(Actions.getDiaryEntryListSuccess());
        } catch (error) {
          dispatch(Actions.createDiaryEntryFailure());
        }
      },
      handleChangeTitle: title => {
        dispatch(Actions.handleChangeDiaryEntry({ title }));
      },
      handleChangeBody: body => {
        dispatch(Actions.handleChangeDiaryEntry({ body }));
      },
      handleChangeEmoji: emoji => {
        dispatch(Actions.handleChangeDiaryEntry({ emoji }));
      },
      handleChangeImage1: image1 => {
        dispatch(Actions.handleChangeDiaryEntry({ image1 }));
      },
      handleChangeImage2: image2 => {
        dispatch(Actions.handleChangeDiaryEntry({ image2 }));
      },
      handleChangeImage3: image3 => {
        dispatch(Actions.handleChangeDiaryEntry({ image3 }));
      },
      deleteImage1: async () => {
        const Api = new ApiClient(store.getState().sessionToken);
        const {
          diaryEntryForm: { id, image1, image2, image3 },
        } = store.getState();
        try {
          dispatch(
            Actions.handleChangeDiaryEntry({
              image1: image2,
              image2: image3,
              image3: null,
            }),
          );
          if (id && image1 && image1.id) {
            await Api.deleteDiaryEntryImage(id, image1.id);
          }
        } catch (e) {
          console.error(e);
          return dispatch(
            Actions.handleChangeDiaryEntry({
              image1,
              image2,
              image3,
            }),
          );
        }
      },
      deleteImage2: async () => {
        const Api = new ApiClient(store.getState().sessionToken);
        const { diaryEntryForm: { id, image2, image3 } } = store.getState();
        try {
          dispatch(
            Actions.handleChangeDiaryEntry({
              image2: image3,
              image3: null,
            }),
          );
          if (id && image2 && image2.id) {
            await Api.deleteDiaryEntryImage(id, image2.id);
          }
        } catch (e) {
          console.error(e);
          return dispatch(
            Actions.handleChangeDiaryEntry({
              image2,
              image3,
            }),
          );
        }
      },
      deleteImage3: async () => {
        const { diaryEntryForm: { id, image3 } } = store.getState();
        const Api = new ApiClient(store.getState().sessionToken);
        try {
          dispatch(Actions.handleChangeDiaryEntry({ image3: null }));
          if (id && image3 && image3.id) {
            await Api.deleteDiaryEntryImage(id, image3.id);
          }
        } catch (e) {
          console.error(e);
          return dispatch(Actions.handleChangeDiaryEntry({ image3 }));
        }
      },
    },
  }),
)(DiaryEntryForm);
