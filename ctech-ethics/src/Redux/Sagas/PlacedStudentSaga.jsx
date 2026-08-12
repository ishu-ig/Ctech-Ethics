import { put, takeEvery } from "redux-saga/effects";

import {
  CREATE_PLACEDSTUDENT,
  CREATE_PLACEDSTUDENT_RED,
  GET_PLACEDSTUDENT,
  GET_PLACEDSTUDENT_RED,
  UPDATE_PLACEDSTUDENT,
  UPDATE_PLACEDSTUDENT_RED,
  DELETE_PLACEDSTUDENT,
  DELETE_PLACEDSTUDENT_RED,
} from "../Constants";

import {
  createMultipartRecord,
  deleteRecord,
  getRecord,
  updateMultipartRecord,
} from "./Service/ApiCallingService";

function* createSaga(action) {
  let response = yield createMultipartRecord("placedstudent", action.payload);

  yield put({
    type: CREATE_PLACEDSTUDENT_RED,
    payload: response.data,
  });
}

function* getSaga() {
  let response = yield getRecord("placedstudent");

  yield put({
    type: GET_PLACEDSTUDENT_RED,
    payload: response.data,
  });
}

function* updateSaga(action) {
  let response = yield updateMultipartRecord("placedstudent", action.payload);

  yield put({
    type: UPDATE_PLACEDSTUDENT_RED,
    payload: response.data,
  });
}

function* deleteSaga(action) {
  yield deleteRecord("placedstudent", action.payload);

  yield put({
    type: DELETE_PLACEDSTUDENT_RED,
    payload: action.payload,
  });
}

export default function* placedStudentSagas() {
  yield takeEvery(CREATE_PLACEDSTUDENT, createSaga);
  yield takeEvery(GET_PLACEDSTUDENT, getSaga);
  yield takeEvery(UPDATE_PLACEDSTUDENT, updateSaga);
  yield takeEvery(DELETE_PLACEDSTUDENT, deleteSaga);
}
