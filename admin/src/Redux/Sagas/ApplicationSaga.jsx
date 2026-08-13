import { put, takeEvery } from "redux-saga/effects";

import {
  CREATE_APPLICATION,
  CREATE_APPLICATION_RED,
  GET_APPLICATION,
  GET_APPLICATION_RED,
  UPDATE_APPLICATION,
  UPDATE_APPLICATION_RED,
  DELETE_APPLICATION,
  DELETE_APPLICATION_RED,
} from "../Constants";

import {
  createMultipartRecord,
  deleteRecord,
  getRecord,
  updateMultipartRecord,
} from "./Service/ApiCallingService";

function* createSaga(action) {
  let response = yield createMultipartRecord("application", action.payload);

  yield put({
    type: CREATE_APPLICATION_RED,
    payload: response.data,
  });
}

function* getSaga() {
  let response = yield getRecord("application");

  yield put({
    type: GET_APPLICATION_RED,
    payload: response.data,
  });
}

function* updateSaga(action) {
  let response = yield updateMultipartRecord("application", action.payload);

  yield put({
    type: UPDATE_APPLICATION_RED,
    payload: response.data,
  });
}

function* deleteSaga(action) {
  yield deleteRecord("application", action.payload);

  yield put({
    type: DELETE_APPLICATION_RED,
    payload: action.payload,
  });
}

export default function* applicationSagas() {
  yield takeEvery(CREATE_APPLICATION, createSaga);
  yield takeEvery(GET_APPLICATION, getSaga);
  yield takeEvery(UPDATE_APPLICATION, updateSaga);
  yield takeEvery(DELETE_APPLICATION, deleteSaga);
}
