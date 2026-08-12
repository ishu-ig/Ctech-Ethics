import { put, takeEvery } from "redux-saga/effects";
import { CREATE_SUBSERVICE, CREATE_SUBSERVICE_RED, DELETE_SERVICE, DELETE_SUBSERVICE, DELETE_SUBSERVICE_RED, GET_SERVICE, GET_SUBSERVICE, GET_SUBSERVICE_RED, UPDATE_SERVICE, UPDATE_SUBSERVICE, UPDATE_SUBSERVICE_RED } from "../Constants"
import { createRecord, deleteRecord, getRecord, updateRecord } from "./Service/ApiCallingService"
// import { createMultipartRecord, deleteRecord, getRecord, updateMultipartRecord } from "./Service/ApiCallingService"


function* createSaga(action) {                          //worker saga or executer saga
    let response = yield createRecord("subservice", action.payload)
    // let response = yield createMultipartRecord("subservice", action.payload)
    yield put({ type: CREATE_SUBSERVICE_RED, payload: response.data })
}

function* getSaga(action) {                             //worker saga or executer saga
    let response = yield getRecord("subservice")
    yield put({ type: GET_SUBSERVICE_RED, payload: response.data })
}

function* updateSaga(action) {                          //worker saga or executer saga
    yield updateRecord("subservice", action.payload)
    yield put({ type: UPDATE_SUBSERVICE_RED, payload: action.payload })
}

function* deleteSaga(action) {                          //worker saga or executer saga
    yield deleteRecord("subservice", action.payload)
    yield put({ type: DELETE_SUBSERVICE_RED, payload: action.payload })
}


export default function* subServiceSagas() {
    yield takeEvery(CREATE_SUBSERVICE, createSaga)    //watcher saga
    yield takeEvery(GET_SUBSERVICE, getSaga)          //watcher saga
    yield takeEvery(UPDATE_SUBSERVICE, updateSaga)    //watcher saga
    yield takeEvery(DELETE_SUBSERVICE, deleteSaga)    //watcher saga
}