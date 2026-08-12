import { put, takeEvery } from "redux-saga/effects";
import { CREATE_SERVICE, CREATE_SERVICE_RED, DELETE_SERVICE, DELETE_SERVICE_RED, GET_SERVICE, GET_SERVICE_RED, UPDATE_SERVICE, UPDATE_SERVICE_RED } from "../Constants"
import { createMultipartRecord, deleteRecord, getRecord, updateMultipartRecord } from "./Service/ApiCallingService"


function* createSaga(action) {                          //worker saga or executer saga
    try {
        let response = yield createMultipartRecord("service", action.payload)
        yield put({ type: CREATE_SERVICE_RED, payload: response.data })
    } catch (error) {
        console.error("Failed to create service:", error)
    }
}

function* getSaga(action) {                             //worker saga or executer saga
    try {
        let response = yield getRecord("service")
        yield put({ type: GET_SERVICE_RED, payload: response.data })
    } catch (error) {
        console.error("Failed to load services:", error)
    }
}

function* updateSaga(action) {                          //worker saga or executer saga
    try {
        let response = yield updateMultipartRecord("service", action.payload)
        yield put({ type: UPDATE_SERVICE_RED, payload: response.data })
    } catch (error) {
        console.error("Failed to update service:", error)
    }
}

function* deleteSaga(action) {                          //worker saga or executer saga
    try {
        yield deleteRecord("service", action.payload)
        yield put({ type: DELETE_SERVICE_RED, payload: action.payload })
    } catch (error) {
        console.error("Failed to delete service:", error)
    }
}


export default function* serviceSagas() {
    yield takeEvery(CREATE_SERVICE, createSaga)    //watcher saga
    yield takeEvery(GET_SERVICE, getSaga)          //watcher saga
    yield takeEvery(UPDATE_SERVICE, updateSaga)    //watcher saga
    yield takeEvery(DELETE_SERVICE, deleteSaga)    //watcher saga
}