import { put, takeEvery } from "redux-saga/effects";

import {
  CREATE_WHYCHOOSEUS,
  CREATE_WHYCHOOSEUS_RED,
  GET_WHYCHOOSEUS,
  GET_WHYCHOOSEUS_RED,
  UPDATE_WHYCHOOSEUS,
  UPDATE_WHYCHOOSEUS_RED,
  DELETE_WHYCHOOSEUS,
  DELETE_WHYCHOOSEUS_RED,
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
  let response = yield createRecord("whychooseus", action.payload);

  yield put({
    type: CREATE_WHYCHOOSEUS_RED,
    payload: response.data,
  });
}

function* getSaga() {
  let response = yield getRecord("whychooseus");

  yield put({
    type: GET_WHYCHOOSEUS_RED,
    payload: response.data,
  });
}

function* updateSaga(action) {
  let response = yield updateRecord ("whychooseus", action.payload);

  yield put({
    type: UPDATE_WHYCHOOSEUS_RED,
    payload: response.data,
  });
}

function* deleteSaga(action) {
  yield deleteRecord("whychooseus", action.payload);

  yield put({
    type: DELETE_WHYCHOOSEUS_RED,
    payload: action.payload,
  });
}

export default function* whyChooseUsSagas() {
  yield takeEvery(CREATE_WHYCHOOSEUS, createSaga);
  yield takeEvery(GET_WHYCHOOSEUS, getSaga);
  yield takeEvery(UPDATE_WHYCHOOSEUS, updateSaga);
  yield takeEvery(DELETE_WHYCHOOSEUS, deleteSaga);
}
