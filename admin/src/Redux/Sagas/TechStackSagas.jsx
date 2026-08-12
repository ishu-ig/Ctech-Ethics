import { put, takeEvery } from "redux-saga/effects";

import {
  CREATE_TECHSTACK,
  CREATE_TECHSTACK_RED,
  GET_TECHSTACK,
  GET_TECHSTACK_RED,
  UPDATE_TECHSTACK,
  UPDATE_TECHSTACK_RED,
  DELETE_TECHSTACK,
  DELETE_TECHSTACK_RED,
} from "../Constants";

import {
  createMultipartRecord,
  createRecord,
  deleteRecord,
  getRecord,
  updateMultipartRecord,
  updateRecord,
} from "./Service/ApiCallingService";

function* createSaga(action) {
  let response = yield createRecord("techstack", action.payload);

  yield put({
    type: CREATE_TECHSTACK_RED,
    payload: response.data,
  });
}

function* getSaga() {
  let response = yield getRecord("techstack");

  yield put({
    type: GET_TECHSTACK_RED,
    payload: response.data,
  });
}

function* updateSaga(action) {
  let response = yield updateRecord ("techstack", action.payload);

  yield put({
    type: UPDATE_TECHSTACK_RED,
    payload: response.data,
  });
}

function* deleteSaga(action) {
  yield deleteRecord("techstack", action.payload);

  yield put({
    type: DELETE_TECHSTACK_RED,
    payload: action.payload,
  });
}

export default function* techStackSagas() {
  yield takeEvery(CREATE_TECHSTACK, createSaga);
  yield takeEvery(GET_TECHSTACK, getSaga);
  yield takeEvery(UPDATE_TECHSTACK, updateSaga);
  yield takeEvery(DELETE_TECHSTACK, deleteSaga);
}
