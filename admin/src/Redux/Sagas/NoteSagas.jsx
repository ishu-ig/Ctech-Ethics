import { put, takeEvery, call } from "redux-saga/effects"
import { CREATE_NOTE, CREATE_NOTE_RED, DELETE_NOTE, DELETE_NOTE_RED, GET_NOTE, GET_NOTE_RED, UPDATE_NOTE, UPDATE_NOTE_RED } from "../Constants"
import { createRecord, deleteRecord, getRecord, updateRecord } from "./Service/ApiCallingService"

function* createSaga(action) {
    try { yield put({ type: CREATE_NOTE_RED, payload: yield call(createRecord, "note", action.payload) }) }
    catch (e) { console.error(e) }
}
function* getSaga() {
    try { yield put({ type: GET_NOTE_RED, payload: yield call(getRecord, "note") }) }
    catch (e) { console.error(e) }
}
function* updateSaga(action) {
    try { yield put({ type: UPDATE_NOTE_RED, payload: yield call(updateRecord, "note", action.payload) }) }
    catch (e) { console.error(e) }
}
function* deleteSaga(action) {
    try {
        yield call(deleteRecord, "note", action.payload)
        yield put({ type: DELETE_NOTE_RED, payload: action.payload })
    } catch (e) { console.error(e) }
}
export default function* noteSagas() {
    yield takeEvery(CREATE_NOTE, createSaga)
    yield takeEvery(GET_NOTE, getSaga)
    yield takeEvery(UPDATE_NOTE, updateSaga)
    yield takeEvery(DELETE_NOTE, deleteSaga)
}
