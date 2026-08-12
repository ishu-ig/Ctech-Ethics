import { put, takeEvery } from "redux-saga/effects";

import {
  CREATE_ABOUT,
  CREATE_ABOUT_RED,
  GET_ABOUT,
  GET_ABOUT_RED,
  UPDATE_ABOUT,
  UPDATE_ABOUT_RED,
  DELETE_ABOUT,
  DELETE_ABOUT_RED,
} from "../Constants";

import {
  createMultipartRecord,
  deleteRecord,
  getRecord,
  updateMultipartRecord,
} from "./Service/ApiCallingService";

function* createSaga(action) {
  let response = yield createMultipartRecord("about", action.payload);

  yield put({
    type: CREATE_ABOUT_RED,
    payload: response.data,
  });
}

function* getSaga() {
  try {
    let response = yield getRecord("about");

    // The backend returns a single singleton document, but
    // AboutReducer/AdminAbout/AdminUpdateAbout all treat AboutStateData
    // as an array (unshift, filter, find, [0]). Normalize into an array
    // here so that contract holds.
    const record = response.data;
    const payload = record ? [record] : [];

    yield put({
      type: GET_ABOUT_RED,
      payload,
    });
  } catch (error) {
    // A 404 here just means no About page has been created yet — that's
    // an expected, normal state (not a real failure), so fall back to an
    // empty list instead of leaving the saga error uncaught.
    if (error?.response?.status === 404) {
      yield put({
        type: GET_ABOUT_RED,
        payload: [],
      });
    } else {
      console.error("Failed to load About page:", error);
    }
  }
}

function* updateSaga(action) {
  let response = yield updateMultipartRecord("about", action.payload);

  yield put({
    type: UPDATE_ABOUT_RED,
    payload: response.data,
  });
}

function* deleteSaga(action) {
  yield deleteRecord("about", action.payload);

  yield put({
    type: DELETE_ABOUT_RED,
    payload: action.payload,
  });
}

export default function* aboutSagas() {
  yield takeEvery(CREATE_ABOUT, createSaga);
  yield takeEvery(GET_ABOUT, getSaga);
  yield takeEvery(UPDATE_ABOUT, updateSaga);
  yield takeEvery(DELETE_ABOUT, deleteSaga);
}