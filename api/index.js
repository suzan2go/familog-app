/* @flow */
import * as url from './url.js';
import uuid from 'uuid';
import qs from 'qs';
import type { DiaryEntryFormState } from '../reducers/diaryEntryForm';

export default class ApiClient {
  sessionToken: ?string;
  constructor(sessionToken: ?string) {
    this.sessionToken = sessionToken;
  }

  async registerDeviceToken() {
    const deviceToken = uuid.v4();
    const response: Response = await this.post(url.DEVICE_URL, { deviceToken });
    const responseJson = await response.json();
    return responseJson.deviceToken;
  }

  async createSessionToken(deviceToken: string) {
    const response: Response = await this.post(url.SESSION_URL, {
      deviceToken,
    });
    const responseJson = await response.json();
    return responseJson.token;
  }

  async createDiary({ title }: { title: string }) {
    const response: Response = await this.post(url.DIARIES_URL, { title });
    const responseJson = await response.json();
    return responseJson;
  }

  async getDiaries() {
    const response: Response = await this.get(url.DIARIES_URL);
    const responseJson = await response.json();
    return responseJson;
  }

  async createDiaryEntry(body: DiaryEntryFormState, diaryID: number) {
    const response: Response = await this.postWithFile(
      url.DIARY_ENTRIES_URL(diaryID),
      body,
    );
    const responseJson = await response.json();
    return responseJson;
  }

  async getDiaryEntries(
    diaryID: number,
    queryParams?: { maxID?: number, sinceID?: number },
  ) {
    const response: Response = await this.get(
      url.DIARY_ENTRIES_URL(diaryID),
      queryParams,
    );
    const responseJson = await response.json();
    return responseJson;
  }

  async getMoreNewerDiaryEntries(diaryID: number, maxId: number) {
    return this.getDiaryEntries(diaryID, {
      max_id: maxId,
    });
  }

  async getMoreOlderDiaryEntries(diaryID: number, sinceId: number) {
    return this.getDiaryEntries(diaryID, {
      since_id: sinceId,
    });
  }

  post(url: string, body: any) {
    return fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: this.sessionToken,
      },
      body: JSON.stringify(body),
    });
  }

  postWithFile(url: string, body: any) {
    const formData = new FormData();
    for (let name in body) {
      formData.append(name, body[name]);
    }
    return fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: this.sessionToken,
      },
      body: formData,
    });
  }

  get(url: string, queryParams?: any) {
    const urlWithQueryString = queryParams
      ? `${url}?${qs.stringify(queryParams)}`
      : url;
    return fetch(urlWithQueryString, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: this.sessionToken,
      },
    });
  }
}
