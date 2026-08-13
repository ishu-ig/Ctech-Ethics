import { put, takeEvery } from "redux-saga/effects";

import {
  CREATE_PLACEMENTAPPLICATION,
  CREATE_PLACEMENTAPPLICATION_RED,
  GET_PLACEMENTAPPLICATION,
  GET_PLACEMENTAPPLICATION_RED,
  UPDATE_PLACEMENTAPPLICATION,
  UPDATE_PLACEMENTAPPLICATION_RED,
  DELETE_PLACEMENTAPPLICATION,
  DELETE_PLACEMENTAPPLICATION_RED,
} from "../Constants";

import {
  createMultipartRecord,
  deleteRecord,
  getRecord,
  updateMultipartRecord,
} from "./Service/ApiCallingService";

function* createSaga(action) {
  let response = yield createMultipartRecord("placementApplication", action.payload);

  yield put({
    type: CREATE_PLACEMENTAPPLICATION_RED,
    payload: response.data,
  });
}

function* getSaga() {
  let response = yield getRecord("placementApplication");

  yield put({
    type: GET_PLACEMENTAPPLICATION_RED,
    payload: response.data,
  });
}

function* updateSaga(action) {
  let response = yield updateMultipartRecord("placementApplication", action.payload);

  yield put({
    type: UPDATE_PLACEMENTAPPLICATION_RED,
    payload: response.data,
  });
}

function* deleteSaga(action) {
  yield deleteRecord("placementApplication", action.payload);

  yield put({
    type: DELETE_PLACEMENTAPPLICATION_RED,
    payload: action.payload,
  });
}

export default function* placementApplicationSagas() {
  yield takeEvery(CREATE_PLACEMENTAPPLICATION, createSaga);
  yield takeEvery(GET_PLACEMENTAPPLICATION, getSaga);
  yield takeEvery(UPDATE_PLACEMENTAPPLICATION, updateSaga);
  yield takeEvery(DELETE_PLACEMENTAPPLICATION, deleteSaga);
}
