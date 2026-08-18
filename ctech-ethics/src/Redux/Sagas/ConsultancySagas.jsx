import { put, takeEvery } from "redux-saga/effects";
import {
    CREATE_CONSULTANCY,
    CREATE_CONSULTANCY_RED,
    DELETE_CONSULTANCY,
    DELETE_CONSULTANCY_RED,
    GET_CONSULTANCY,
    GET_CONSULTANCY_RED,
    UPDATE_CONSULTANCY,
    UPDATE_CONSULTANCY_RED
} from "../Constants";
import { createRecord, deleteRecord, getRecord, updateRecord } from "./Service/ApiCallingService";

function* createSaga(action) {
    try {
        let response = yield createRecord("consultancy", action.payload);
        yield put({ type: CREATE_CONSULTANCY_RED, payload: response?.data || response });
    } catch (error) {
        console.error("Error creating consultancy record:", error);
    }
}

function* getSaga() {
    try {
        let response = yield getRecord("consultancy");
        yield put({ type: GET_CONSULTANCY_RED, payload: response?.data || response });
    } catch (error) {
        console.error("Error fetching consultancy records:", error);
    }
}

function* updateSaga(action) {
    try {
        yield updateRecord("consultancy", action.payload);
        yield put({ type: UPDATE_CONSULTANCY_RED, payload: action.payload });
    } catch (error) {
        console.error("Error updating consultancy record:", error);
    }
}

function* deleteSaga(action) {
    try {
        yield deleteRecord("consultancy", action.payload);
        yield put({ type: DELETE_CONSULTANCY_RED, payload: action.payload });
    } catch (error) {
        console.error("Error deleting consultancy record:", error);
    }
}

export default function* consultancySagas() {
    yield takeEvery(CREATE_CONSULTANCY, createSaga);
    yield takeEvery(GET_CONSULTANCY, getSaga);
    yield takeEvery(UPDATE_CONSULTANCY, updateSaga);
    yield takeEvery(DELETE_CONSULTANCY, deleteSaga);
}
