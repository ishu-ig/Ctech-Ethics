import { put, takeEvery } from "redux-saga/effects";
import { CREATE_TEAMS, CREATE_TEAMS_RED, DELETE_TEAMS, DELETE_TEAMS_RED, GET_TEAMS, GET_TEAMS_RED, UPDATE_TEAMS, UPDATE_TEAMS_RED } from "../Constants"
import { deleteRecord, getRecord, createMultipartRecord, updateMultipartRecord } from "./Service/ApiCallingService"


function* createSaga(action) {                          //worker saga or executer saga
    let response = yield createMultipartRecord("teams", action.payload)
    yield put({ type: CREATE_TEAMS_RED, payload: response.data })
}

function* getSaga(action) {                             //worker saga or executer saga
    let response = yield getRecord("teams")
    yield put({ type: GET_TEAMS_RED, payload: response.data })
}

function* updateSaga(action) {                          //worker saga or executer saga
    yield updateMultipartRecord("teams", action.payload)
    yield put({ type: UPDATE_TEAMS_RED, payload: action.payload })
}

function* deleteSaga(action) {                          //worker saga or executer saga
    yield deleteRecord("teams", action.payload)
    yield put({ type: DELETE_TEAMS_RED, payload: action.payload })
}


export default function* teamsSagas() {
    yield takeEvery(CREATE_TEAMS, createSaga)    //watcher saga
    yield takeEvery(GET_TEAMS, getSaga)          //watcher saga
    yield takeEvery(UPDATE_TEAMS, updateSaga)    //watcher saga
    yield takeEvery(DELETE_TEAMS, deleteSaga)    //watcher saga
}